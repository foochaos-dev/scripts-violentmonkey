// Shimmonkey — a tiny stand-in for a userscript manager, for bookmarklets
//
// This file is a single function expression: `bookmarklet.js` fetches it
// from the git repo, evals it and calls the result with a userscript's URL,
// so fixes land here without anyone re-creating their bookmark.
//
// It downloads the userscript, then, like a userscript manager would, runs it
// in every window whose URL matches one of its `@match` patterns: the page
// itself and its same-origin iframes (bateworld's chat lives in
// `iframe#iframeChat`). In each one it loads the `@require`s, installs the
// GM_*/GM.* APIs and runs the code there.
//
// Won't re-run in a window it has already run in (tracked via a flag on that
// window; the flag naturally resets whenever the window reloads).
(async scriptUrl => {
	const FLAG = `__shimmonkey_ran__${scriptUrl}`;

	try {
		const source = await fetch(scriptUrl).then(r => {
			if (!r.ok) throw new Error(`HTTP ${r.status} fetching ${scriptUrl}`);
			return r.text();
		});

		const meta = key => [...source.matchAll(new RegExp(`^//\\s*@${key}\\s+(.+?)\\s*$`, "gm"))].map(m => m[1]);
		const name = meta("name")[0] || scriptUrl;
		const matches = meta("match").map(matchPatternToRegExp);
		const requires = meta("require");
		// Strip the ==UserScript== header block; it's metadata, not code.
		const code = source.replace(/\/\/\s*==UserScript==[\s\S]*?\/\/\s*==\/UserScript==/, "");

		const targets = allWindows(window).filter(w => matches.some(re => re.test(w.location.href)));
		if (!targets.length) return alert(`${name}: nothing to run on this page.`);
		if (targets.every(w => w[FLAG])) return alert(`${name} is already running.`);

		for (const w of targets) {
			if (w[FLAG]) continue;
			for (const url of requires) await loadScript(w, url);
			installGmShims(w, name);
			// Built with the window's own Function constructor, so the code's globals
			// (window, document, location, GM_*, the @required preact...) resolve
			// against that window, not the one the bookmarklet was clicked from.
			new w.Function(code)();
			w[FLAG] = true;
		}
	} catch (err) {
		alert(`Shimmonkey failed: ${err.message}`);
		throw err;
	}

	// The window and every same-origin frame under it; cross-origin ones throw on access and are skipped.
	function allWindows(w) {
		const frames = [];
		for (let i = 0; i < w.frames.length; i++) {
			try {
				w.frames[i].location.href; // throws when cross-origin
				frames.push(...allWindows(w.frames[i]));
			} catch {}
		}
		return [w, ...frames];
	}

	// `https://host/path/*` → /^https:\/\/host\/path\/.*$/. Only `*` is a wildcard; that covers the
	// patterns userscripts here use, not `*.host` subdomain or `*://` scheme wildcards' exact rules.
	function matchPatternToRegExp(pattern) {
		const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replace(/\*/g, ".*");
		return new RegExp(`^${escaped}$`);
	}

	// A trailing `#sha512-...` fragment is an SRI hash; the browser verifies it
	// itself through `integrity` (needs CORS, which unpkg sends).
	function loadScript(w, url) {
		const [src, hash] = url.split("#");
		return new Promise((resolve, reject) => {
			const el = w.document.createElement("script");
			el.src = src;
			if (hash) {
				el.integrity = hash;
				el.crossOrigin = "anonymous";
			}
			el.onload = resolve;
			el.onerror = () => reject(new Error(`Failed to load @require ${url}`));
			w.document.head.append(el);
		});
	}

	// The userscript expects a userscript manager's GM_*/GM.* storage and
	// style APIs. There's no manager here, so back them with localStorage
	// (persists across reloads, same as a real manager; keyed by the script's
	// @name so scripts don't share values) and a plain <style> tag.
	//
	// Skipped if GM_getValue is already there: a real userscript manager beat us to
	// this window (its content scripts can run before ours), and its APIs should win.
	function installGmShims(w, name) {
		if (w.GM_getValue) return;

		const PREFIX = `shimmonkey:${name}:`;
		const storage = w.localStorage;

		const getValue = (key, defaultValue) => {
			const raw = storage.getItem(PREFIX + key);
			return raw === null ? defaultValue : JSON.parse(raw);
		};
		const deleteValue = key => storage.removeItem(PREFIX + key);
		// JSON.stringify(undefined) is undefined, which setItem would store as the unparsable "undefined".
		const setValue = (key, value) =>
			value === undefined ? deleteValue(key) : storage.setItem(PREFIX + key, JSON.stringify(value));
		const listValues = () =>
			Object.keys(storage)
				.filter(k => k.startsWith(PREFIX))
				.map(k => k.slice(PREFIX.length));
		const setValues = values => Object.entries(values).forEach(([k, v]) => setValue(k, v));
		const addStyle = css => {
			const el = w.document.createElement("style");
			el.textContent = css;
			w.document.head.append(el);
			return el;
		};

		Object.assign(w, {
			GM_getValue: getValue,
			GM_setValue: setValue,
			GM_deleteValue: deleteValue,
			GM_listValues: listValues,
			GM_setValues: setValues,
			GM_addStyle: addStyle,
		});
		w.GM = {
			getValue: async (...args) => getValue(...args),
			setValue: async (...args) => setValue(...args),
			deleteValue: async (...args) => deleteValue(...args),
			listValues: async () => listValues(),
			setValues: async (...args) => setValues(...args),
			addStyle: async (...args) => addStyle(...args),
		};
	}
});
