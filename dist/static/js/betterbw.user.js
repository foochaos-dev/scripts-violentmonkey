// ==UserScript==
// @name        Better bateworld.com
// @namespace   Circlejerk Scripts
// @version     1.9.1
// @author      Thick Bro
// @match       https://bateworld.com/html5-chat/chatroom.php
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM.addStyle
// @grant       GM_getValue
// @grant       GM.getValue
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_setValues
// @grant       GM.setValues
// @grant       GM_listValues
// @grant       GM.listValues
// @grant       GM_deleteValue
// @grant       GM.deleteValue
// @require     https://unpkg.com/preact@10.28.0/dist/preact.min.js#sha512-iMvQ2nmrBGovAh+dbYrh8gttIQ4Xa/aYwXhrgYdlhNHDXdyQA4tM0JyI81xJEm+laaTWnIhWGgawYgpEihg7AQ==
// @require     https://unpkg.com/preact@10.28.0/hooks/dist/hooks.umd.js#sha512-lLsbsdkj5qskElcWFvsifiWNJH4y8GeUtEdI3a1KZoVF+TCDvk/UGCyf/2mKpJtwI1XKJh89hVCVI2J3rEytQQ==
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// ==/UserScript==

// file://./src/betterbw/features/cooldown.ts
function cooldownIt({ username, minutes = 15, panel }) {
	if (!username) return;
	const expiry = Date.now() + 60000 * minutes;
	GM.setValue(`${username}_cooldown`, expiry);
	if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}
async function isOnCooldown(id) {
	const val = await GM.getValue(`${id}_cooldown`);
	if (!val) return null;
	if (Date.now() < Number(val)) return true;
	GM.deleteValue(`${id}_cooldown`);
	return false;
}
async function sweepExpiredCooldowns() {
	const keys = (await GM.listValues()).filter(key => key.endsWith("_cooldown"));
	const now = Date.now();
	for (const key of keys) if (now >= Number(await GM.getValue(key))) await GM.deleteValue(key);
}
const sessionCooldown = new Set();

// file://./src/betterbw/utils/filters.ts
const isDefined = v => null != v;

// file://./src/betterbw/utils/math.ts
const clamp = (min, mid, max) => Math.max(min, Math.min(mid, max));

// file://./src/betterbw/features/settings.ts
const DEFAULTS = {
	watchNotifications: "off",
	defaultVolume: 0.08,
	scrollToVolume: true,
	pinchToZoom: true,
	preferredAlgo: "top",
	layout: "adaptable",
	classicWidth: 365,
	adaptableRows: 3,
	camsMoveAway: true,
};
const getSetting = key => GM_getValue(`settings.${key}`, DEFAULTS[key]);
const setSetting = (key, value) => GM.setValue(`settings.${key}`, value);
const SITE_OPTIONS = [
	{ group: "Sidebar", key: "displayConnectedSince", label: "For how long buddies are online" },
	{ group: "Chat", key: "groupMessages", label: "Group messages in a row from the same buddy" },
	{ group: "Chat", key: "showMessageServer", label: "Enter, leave and kick notices" },
	{ group: "Chat", key: "hideMessageServerAfterNseconds", label: "Hide those notices after", type: "number", unit: "s (0: never)" },
	{ group: "Cams", key: "soundMutedAtStart", label: "Start cams muted" },
];
const FORCED_SITE_OPTIONS = { openMostPopularCamAutomatically: "0" };
const siteOptionKey = key => `settings.site.${key}`;
function applySiteOptions() {
	Object.assign(chatHTML5.config, FORCED_SITE_OPTIONS);
	for (const { key } of SITE_OPTIONS) {
		const value = GM_getValue(siteOptionKey(key), null);
		if (null !== value) chatHTML5.config[key] = value;
	}
}
function setSiteOption(key, value) {
	chatHTML5.config[key] = value;
	GM.setValue(siteOptionKey(key), value);
}

// file://./src/betterbw/utils/organizePanels.ts

const LAYOUT_LABELS = { classic: "Classic grid (3 rows)", adaptable: "Adaptable grid (N rows)" };
const organizePanels_base = { my: "right-top", at: "right-top" };
const panelRatio = 314 / 365;
const gridconf = {
	MARGIN_TOP: 30,
	MARGIN_RIGHT: 5,
	GAP_X: 4,
	GAP_Y: 4,
	WIDTH: +GM_getValue("config.webcamWidth", 365),
	HEIGHT: GM_getValue("config.webcamWidth", 365) * panelRatio,
};
const MAX_ROWS = 8;
function classicLayout() {
	const width = getSetting("classicWidth");
	return { width, height: width * panelRatio, cols: 3, rows: 3 };
}
function adaptableLayout() {
	const areaWidth = innerWidth - (document.getElementById("tabsAndFooter")?.getBoundingClientRect().right ?? 0) - gridconf.MARGIN_RIGHT;
	const areaHeight = innerHeight - gridconf.MARGIN_TOP;
	const rows = clamp(1, getSetting("adaptableRows"), 8);
	const fitHeight = (areaHeight - (rows - 1) * gridconf.GAP_Y) / rows;
	const width = Math.floor(Math.max(120, Math.min(gridconf.WIDTH, areaWidth, fitHeight / panelRatio)));
	const cols = Math.max(1, Math.floor((areaWidth + gridconf.GAP_X) / (width + gridconf.GAP_X)));
	return { width, height: width * panelRatio, cols, rows };
}
const computeLayout = () => ("classic" === getSetting("layout") ? classicLayout() : adaptableLayout());
function camsWidth() {
	return 3 * (("classic" === getSetting("layout") ? getSetting("classicWidth") : gridconf.WIDTH) + gridconf.GAP_X) - gridconf.GAP_X + gridconf.MARGIN_RIGHT;
}
function* gridPositions({ width, height, cols, rows }) {
	const place = (c, r) => ({
		...organizePanels_base,
		offsetX: -(gridconf.MARGIN_RIGHT + c * (width + gridconf.GAP_X)),
		offsetY: gridconf.MARGIN_TOP + r * (height + gridconf.GAP_Y),
	});
	for (let band = 0; band < rows; band += 2) for (let c = 0; c < cols; c++) for (let r = band; r < Math.min(band + 2, rows); r++) yield place(c, r);
	for (let c = cols; ; c++) for (let r = 0; r < rows; r++) yield place(c, r);
}
function placeInSlot(panel, index) {
	const layout = computeLayout();
	const positions = gridPositions(layout);
	for (let i = 0; i < index; i++) positions.next();
	const position = positions.next().value;
	if (position) jsPanel.activePanels.getPanel(panel.id)?.resize({ width: layout.width, height: layout.height }).reposition(position);
}
function organizePanels() {
	document.documentElement.style.setProperty("--bbw-cams-width", `${camsWidth()}px`);
	const opened = queryPanels();
	if (!opened.length) return;
	const layout = computeLayout();
	const baseCells = layout.cols * layout.rows;
	let lastIndex = 0;
	const groups = { prePositioned: [], newlyCreated: [] };
	for (const panel of opened) {
		const gridIndex = panel.dataset.gridIndex;
		if (gridIndex) {
			groups.prePositioned.push(panel);
			const gridIndexNumber = +gridIndex;
			if (gridIndexNumber > lastIndex) lastIndex = gridIndexNumber;
		} else groups.newlyCreated.push(panel);
	}
	const grid = Array(Math.max(+chatHTML5.roles.user.webcamMax, opened.length, lastIndex)).fill(null);
	for (const panel of groups.prePositioned)
		if (null != panel.dataset.gridIndex && "" !== panel.dataset.gridIndex)
			if (grid[+panel.dataset.gridIndex]) {
				panel.dataset.gridIndex = "";
				groups.newlyCreated.unshift(panel);
			} else grid[+panel.dataset.gridIndex] = panel;
	for (let i = grid.length - 1; i >= baseCells; i--) {
		if (!grid[i]) continue;
		const nextAvailableSlot = grid.indexOf(null);
		if (!(nextAvailableSlot < 0) && !(nextAvailableSlot >= i)) {
			grid[i].dataset.gridIndex = nextAvailableSlot.toString();
			grid[nextAvailableSlot] = grid[i];
			grid[i] = null;
		}
	}
	const newlyPlaced = new Set();
	for (const panel of groups.newlyCreated) {
		const nextAvailableSlot = grid.indexOf(null);
		if (nextAvailableSlot < 0) grid.push(panel);
		else grid[nextAvailableSlot] = panel;
		newlyPlaced.add(panel);
	}
	const positions = gridPositions(layout);
	const poppedIn = [];
	grid.forEach((place, index) => {
		const position = positions.next().value;
		if (!place || !position) return;
		const isNew = newlyPlaced.has(place);
		if (isNew) {
			place.style.transition = "none";
			poppedIn.push(place);
		}
		const panel = jsPanel.activePanels.getPanel(place.id);
		if (panel) panel.resize({ width: layout.width, height: layout.height }).reposition(position);
		if (isNew) place.dataset.gridIndex = index.toString();
	});
	if (poppedIn.length) {
		poppedIn[0].offsetHeight;
		requestAnimationFrame(() => {
			for (const panel of poppedIn) panel.style.transition = "";
		});
	}
}

// file://./src/betterbw/utils/scrappers.ts
function getUserId(panel) {
	return panel.id.split("_")[2] || $("[data-id]", panel)[0]?.dataset.id;
}
function scrappers_getUsername(panel) {
	const id = getUserId(panel);
	return id && getUserById(id)?.username?.split("_")?.[0];
}
function getUserObjectById(userId) {
	return chatHTML5.users[userId];
}
function getUserById(userId) {
	const user = getUserObjectById(userId);
	if (!user) return;
	return { obj: user, username: user.username.split("_")[0] };
}

// file://./src/betterbw/utils/sortFunctions.ts
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

// file://./src/betterbw/algo.ts
let algo_algo = "";
const getAlgo = () => algo_algo;
const setAlgo = val => {
	document.body.dataset.algo = algo_algo = val;
};

// file://./src/betterbw/utils/openPanel.ts

let openPanel_roomSelected = false;
const setRoomSelected = () => (openPanel_roomSelected = true);
const PANEL_SELECTOR = ".jsPanel.jsPanel-theme-default";
const queryPanels = () => document.querySelectorAll(PANEL_SELECTOR);
const queryPanel = (target = document) => target.querySelector(PANEL_SELECTOR);
function clickWebcamButton(button) {
	const menuWasOpen = $("#userMenu").is(":visible");
	button.trigger("click");
	if (!menuWasOpen) $("#userMenu").hide();
}
function tryToOpenPanel(candidate) {
	clickWebcamButton($(".webcamBtn", candidate.item));
}
const hasPanel = username => Array.from(document.querySelectorAll(PANEL_SELECTOR)).some(panel => scrappers_getUsername(panel) === username);
function verifyOpened(candidate, fallbacks) {
	setTimeout(() => {
		if (hasPanel(candidate.username)) return;
		const full_username = candidate.item.dataset.username;
		if (full_username) {
			sessionCooldown.add(full_username);
			setTimeout(() => sessionCooldown["delete"](full_username), 1800000);
		}
		if (
			"" === getAlgo()
			|| !(() => {
				const max = +chatHTML5.roles.user.webcamMax;
				return document.querySelectorAll(PANEL_SELECTOR).length < max && chatHTML5.getWebcamNumber() < max;
			})()
		)
			return;
		let next = fallbacks.shift();
		while (next && hasPanel(next.username)) next = fallbacks.shift();
		if (!next) return;
		tryToOpenPanel(next);
		verifyOpened(next, fallbacks);
	}, 6000);
}
const getCandidates = async (compareFn = topRandom, _biases = {}) => {
	const biases = { "-": 1, undefined: 2, "+": 3, "++": 4, ..._biases };
	const promises = Array.from(
		document.querySelectorAll('#userList [data-status="online"][data-webcam="true"]:not(:has(:is(.fa.fa-lock, .fa.fa-eye-slash)))').values(),
	).map(async item => {
		const full_username = item.dataset.username;
		const username = full_username?.split("_")[0];
		if (!username) return;
		if (sessionCooldown.has(full_username)) return;
		const status = await GM.getValue(`${username}_status`);
		if ("--" === status) return;
		if (await isOnCooldown(username)) return;
		return { item, username, status, bias: biases[status], onlineSince: (item.dataset.id && getUserById(item.dataset.id)?.obj.date) || 0 };
	});
	return await Promise.all(promises).then(list => list.filter(isDefined).sort(compareFn));
};
function openCandidates(candidates) {
	if (!openPanel_roomSelected) return;
	const opened = document.querySelectorAll(PANEL_SELECTOR);
	let openedLength = opened.length || 0;
	const maxToOpen = +chatHTML5.roles.user.webcamMax;
	if (openedLength >= maxToOpen) return void organizePanels();
	const openedIds = new Set(Array.from(opened).map(panel => scrappers_getUsername(panel)));
	while (openedLength < maxToOpen && candidates.length > 0) {
		const c = candidates.shift();
		if (openedIds.has(c.username)) continue;
		tryToOpenPanel(c);
		verifyOpened(c, candidates);
		openedLength++;
	}
	organizePanels();
}

// file://./src/betterbw/utils/waitToBe.ts
function waitToBe(selector, attributeFilter = ["aria-hidden"], predicate = el => "false" !== el.getAttribute("aria-hidden")) {
	return new Promise(resolve => {
		let attrObserver = null;
		let domObserver = null;
		function cleanup() {
			if (attrObserver) {
				attrObserver.disconnect();
				attrObserver = null;
			}
			if (domObserver) {
				domObserver.disconnect();
				domObserver = null;
			}
		}
		function attachAttrObserver(el) {
			if (!el) return false;
			if (predicate(el)) {
				cleanup();
				resolve(el);
				return true;
			}
			(attrObserver = new MutationObserver(muts => {
				for (const m of muts)
					if ("attributes" === m.type && m.attributeName && attributeFilter.includes(m.attributeName)) {
						if (predicate(el)) {
							cleanup();
							resolve(el);
							return;
						}
					}
			})).observe(el, { attributes: true, attributeFilter });
			return false;
		}
		const existing = document.querySelector(selector);
		if (attachAttrObserver(existing)) return;
		(domObserver = new MutationObserver(muts => {
			for (const m of muts)
				for (const node of m.addedNodes) {
					if (!(node instanceof HTMLElement)) continue;
					const found = node.matches(selector) ? node : node.querySelector(selector);
					if (found) {
						if (attachAttrObserver(found)) {
							if (domObserver) {
								domObserver.disconnect();
								domObserver = null;
							}
							return;
						}
					}
				}
		})).observe(document.body, { childList: true, subtree: true });
	});
}

const { h, Fragment } = window.preact;

// file://./src/betterbw/utils/formatters.ts
const dataUsername = id => `[data-username="${id}"],[data-username^="${id}_"]`;
const HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const escapeHtml = text => text.replace(/[&<>"']/g, char => HTML_ESCAPES[char]);

// file://./src/betterbw/styles/tiers.css?raw
const tiers_css = `
#userList .userItem:where(.group_minus_minus) {
	opacity: 0.3 !important;
}
#tabs .userLabelBBW:where(.group_minus_minus) {
	text-decoration: line-through solid 1.8rem rgba(205, 0, 0, 0.15);
}
#tabs .userLabelBBW:where(.group_minus) {
	text-decoration: line-through solid 1.8rem rgba(237, 146, 0, 0.2);
}
#userList .userItem:where(.group_minus) .userLabel {
	background: rgba(237, 146, 0, 0.2);
}
#tabs .userLabelBBW:where(.group_plus) {
	text-decoration: line-through solid 1.8rem rgba(0, 100, 255, 0.2);
}
#userList .userItem:where(.group_plus) .userLabel {
	background: rgba(0, 100, 255, 0.2);
}
#tabs .userLabelBBW:where(.group_plus_plus) {
	text-decoration: line-through solid 1.8rem rgba(149, 50, 255, 0.2);
}
#userList .userItem:where(.group_plus_plus) .userLabel {
	background: rgba(149, 50, 255, 0.2);
}
`;

// file://./src/betterbw/utils/debounce.ts
function debounce(func, wait = 200) {
	let timeout;
	return function (...args) {
		const context = this;
		clearTimeout(timeout);
		timeout = setTimeout(() => func.apply(context, args), wait);
	};
}
function enqueueAsync(func) {
	let isRunning = false;
	let runAgain = false;
	return async () => {
		if (isRunning) {
			runAgain = true;
			return;
		}
		isRunning = true;
		try {
			do {
				runAgain = false;
				await func();
			} while (runAgain);
		} finally {
			isRunning = false;
		}
	};
}

// file://./src/betterbw/dynamicStyle.ts

const dataUserItems = group => group.map(dataUsername).join(",");
async function getCSS() {
	const keys = (await GM.listValues()).filter(key => key.endsWith("_status"));
	const valuesEntries = await Promise.all(keys.map(async key => [key, await GM.getValue(key)]));
	const groups = { "--": [], "-": [], "+": [], "++": [] };
	for (const [key, value] of valuesEntries) {
		const id = key.split("_")[0];
		groups[value]?.push(id);
	}
	const selectors = {
		group_minus_minus: dataUserItems(groups["--"]),
		group_minus: dataUserItems(groups["-"]),
		group_plus: dataUserItems(groups["+"]),
		group_plus_plus: dataUserItems(groups["++"]),
	};
	return tiers_css.replace(/\.(group_\w+)/gm, (_match, key, openStyle) => selectors[key] + openStyle);
}
const dynamicStyle = GM_addStyle("");
const refreshDynamicStyle = enqueueAsync(async () => {
	dynamicStyle.innerHTML = await getCSS();
});
refreshDynamicStyle();

// file://./src/betterbw/features/rotateCam.tsx
function getRotation(element) {
	if (!element || !element.dataset.rotation) return 0;
	return parseInt(element.dataset.rotation, 10) || 0;
}
async function rotateCam({ id, panel }) {
	const newRotation = (getRotation(panel) + 90) % 360;
	panel.dataset.rotation = newRotation;
	return GM.setValue(`${id}_rotation`, newRotation);
}

// file://./src/betterbw/features/audioMuted.ts
const sessionAudioMuted = new Map();

// file://./src/betterbw/features/sessionZoom.ts
const sessionZoom = new Map();

// file://./src/betterbw/utils/wheel.ts
const LINE_PX = 100 / 3;
const IS_MAC = /Mac/.test(navigator.userAgent);
function unitPx(mode) {
	return mode === WheelEvent.DOM_DELTA_LINE ? LINE_PX : mode === WheelEvent.DOM_DELTA_PAGE ? 800 : 1;
}
function deltaPx(event) {
	return event.deltaY * unitPx(event.deltaMode);
}
function upwardPx(event) {
	return (event.webkitDirectionInvertedFromDevice ?? IS_MAC) ? deltaPx(event) : -deltaPx(event);
}

// file://./src/betterbw/styles/videoControls.css?raw
const vc_css = `
.bbw-controls {
	position: absolute;
	z-index: 2;
	left: 0;
	right: 0;
	bottom: 0;
	display: flex;
	align-items: center;
	gap: 6px;
	box-sizing: border-box;
	height: 30px;
	padding: 0 20px 0 8px;
	background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
	color: #fff;
	font-size: 12px;
	opacity: 0;
	pointer-events: none;
	transition: opacity 0.2s ease-out;
	&.visible {
		opacity: 1;
		pointer-events: auto;
	}
	button {
		all: unset;
		width: 20px;
		line-height: 30px;
		text-align: center;
		cursor: pointer;
		opacity: 0.85;
		&:hover {
			opacity: 1;
		}
		&:disabled {
			opacity: 0.3;
			cursor: default;
		}
		&[hidden] {
			display: none;
		}
	}
	.bbw-floating-controls {
		position: absolute;
		right: 2px;
		bottom: 100%;
		margin-bottom: 2px;
		display: flex;
		align-items: flex-end;
		gap: 4px;
	}
	.bbw-zoom-controls,
	.bbw-rotate {
		display: flex;
		flex-direction: column;
		border-radius: 4px;
		background: rgba(0, 0, 0, 0.5);
		button {
			line-height: 22px;
			font-size: 11px;
		}
	}
	input[type='range'] {
		width: 70px;
		height: 12px;
		margin: 0;
		accent-color: #fff;
		cursor: pointer;
	}
	.bbw-spacer {
		flex: 1;
	}
}
.webcamSwfContainer:fullscreen {
	align-items: center;
	background: #000;
}
`;

// file://./src/betterbw/features/videoControls.ts

let styleAdded = false;
function volumeOnScroll(video) {
	let target = null;
	const step = () => {
		if (null === target) return;
		const current = video.volume ** 0.3333333333333333;
		const next = current + (target - current) * 0.3;
		const arrived = Math.abs(target - next) < 0.001;
		video.volume = (arrived ? target : next) ** 3;
		if (arrived) target = null;
		else requestAnimationFrame(step);
	};
	return event => {
		const upward = upwardPx(event);
		if (video.muted && upward > 0) video.muted = false;
		const idle = null === target;
		target = clamp(0, (target ?? video.volume ** 0.3333333333333333) + upward / 6000, 1);
		if (idle) requestAnimationFrame(step);
	};
}
function makeButton(title, onClick) {
	const button = document.createElement("button");
	button.type = "button";
	button.title = title;
	button.addEventListener("click", event => {
		event.stopPropagation();
		onClick();
	});
	return button;
}
function setIcon(button, name) {
	if (button.dataset.icon === name) return;
	button.dataset.icon = name;
	button.innerHTML = `<i class="fa fa-${name}"></i>`;
}
function autoHide(container, bar, video) {
	let timer;
	let overBar = false;
	const hide = () => {
		if (!overBar && !video.paused) bar.classList.remove("visible");
	};
	const show = () => {
		bar.classList.add("visible");
		clearTimeout(timer);
		timer = setTimeout(hide, 2000);
	};
	container.addEventListener("pointermove", show);
	container.addEventListener("pointerleave", () => {
		clearTimeout(timer);
		overBar = false;
		hide();
	});
	bar.addEventListener("pointerenter", () => {
		overBar = true;
	});
	bar.addEventListener("pointerleave", () => {
		overBar = false;
		show();
	});
	video.addEventListener("play", show);
	video.addEventListener("pause", show);
	if (video.paused) bar.classList.add("visible");
}
function makeZoomButtons(zoom) {
	const zoomIn = makeButton("Zoom in", zoom.zoomIn);
	const zoomOut = makeButton("Zoom out", zoom.zoomOut);
	setIcon(zoomIn, "plus");
	setIcon(zoomOut, "minus");
	const sync = () => {
		zoomIn.disabled = !zoom.canZoomIn();
		zoomOut.disabled = !zoom.isZoomed();
	};
	zoom.onChange(sync);
	sync();
	const buttons = document.createElement("div");
	buttons.className = "bbw-zoom-controls";
	buttons.append(zoomIn, zoomOut);
	return buttons;
}
function makeRotateButton(onRotate) {
	const rotate = makeButton("Rotate", onRotate);
	rotate.textContent = "⟳";
	const group = document.createElement("div");
	group.className = "bbw-rotate";
	group.append(rotate);
	return group;
}
function attachVideoControls(video, zoom, onRotate) {
	if (!styleAdded) {
		GM.addStyle(vc_css);
		styleAdded = true;
	}
	video.controls = false;
	new MutationObserver(() => {
		if (video.controls) video.controls = false;
	}).observe(video, { attributes: true, attributeFilter: ["controls"] });
	const container = video.parentElement;
	if ("static" === getComputedStyle(container).position) container.style.position = "relative";
	const bar = document.createElement("div");
	bar.className = "bbw-controls";
	const play = makeButton("Play / pause", () => (video.paused ? video.play() : video.pause()));
	const mute = makeButton("Mute", () => {
		video.muted = !video.muted;
	});
	const volume = document.createElement("input");
	volume.type = "range";
	volume.min = "0";
	volume.max = "1";
	volume.step = "0.01";
	volume.title = "Volume\nScroll over the controls to adjust it";
	volume.addEventListener("input", () => {
		video.muted = false;
		video.volume = Number(volume.value) ** 3;
	});
	const spacer = document.createElement("span");
	spacer.className = "bbw-spacer";
	const toggleFullscreen = () => (document.fullscreenElement === container ? document.exitFullscreen() : container.requestFullscreen());
	const fullscreen = makeButton("Full screen\nor double-click the cam", toggleFullscreen);
	video.addEventListener("dblclick", toggleFullscreen);
	const floating = document.createElement("div");
	floating.className = "bbw-floating-controls";
	floating.append(makeRotateButton(onRotate), makeZoomButtons(zoom));
	bar.append(play, spacer, mute, volume, fullscreen, floating);
	container.appendChild(bar);
	const sync = () => {
		setIcon(play, video.paused ? "play" : "pause");
		setIcon(mute, video.muted || 0 === video.volume ? "volume-off" : "volume-up");
		setIcon(fullscreen, document.fullscreenElement === container ? "compress" : "expand");
		volume.value = String(video.muted ? 0 : video.volume ** 0.3333333333333333);
	};
	for (const type of ["play", "pause", "volumechange"]) video.addEventListener(type, sync);
	container.addEventListener("fullscreenchange", sync);
	sync();
	autoHide(container, bar, video);
	const onVolumeWheel = volumeOnScroll(video);
	bar.addEventListener(
		"wheel",
		event => {
			event.preventDefault();
			if (getSetting("scrollToVolume")) onVolumeWheel(event);
		},
		{ passive: false },
	);
}

// file://./src/betterbw/features/videoGestures.ts

function isWheelNotch(event) {
	const delta = Math.abs(event.deltaY);
	return event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL || delta % 4.000244140625 === 0 || (Number.isInteger(delta) && delta >= 50);
}
function zoomAndPan(video, initial) {
	let scale = initial?.scale ?? 1;
	let x = initial?.x ?? 0;
	let y = initial?.y ?? 0;
	let drag = null;
	const clip = video.closest(".jsPanel-content") ?? video.parentElement;
	const listeners = new Set();
	const render = () => {
		const zoomed = scale > 1;
		video.style.scale = zoomed ? `${scale}` : "";
		video.style.translate = zoomed ? `${x}px ${y}px` : "";
		video.style.cursor = drag?.moved ? "grabbing" : zoomed ? "grab" : "";
		if (clip) clip.style.overflow = zoomed ? "hidden" : "";
		listeners.forEach(listener => listener());
	};
	const moveTo = (rect, nextX, nextY, nextScale = scale) => {
		const maxX = ((nextScale - 1) * rect.width) / scale / 2;
		const maxY = ((nextScale - 1) * rect.height) / scale / 2;
		x = clamp(-maxX, nextX, maxX);
		y = clamp(-maxY, nextY, maxY);
		scale = nextScale;
		render();
	};
	const zoomAt = (rect, cx, cy, factor) => {
		const next = clamp(1, scale * factor, 4);
		moveTo(rect, cx - (next / scale) * (cx - x), cy - (next / scale) * (cy - y), next);
	};
	video.addEventListener("pointerdown", event => {
		if (1 === scale || 0 !== event.button) return;
		event.preventDefault();
		video.setPointerCapture(event.pointerId);
		drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, fromX: x, fromY: y, moved: false };
	});
	video.addEventListener("pointermove", event => {
		if (drag?.pointerId !== event.pointerId) return;
		const dx = event.clientX - drag.startX;
		const dy = event.clientY - drag.startY;
		if (!drag.moved && Math.hypot(dx, dy) < 3) return;
		drag.moved = true;
		moveTo(video.getBoundingClientRect(), drag.fromX + dx, drag.fromY + dy);
	});
	const endDrag = event => {
		if (drag?.pointerId !== event.pointerId) return;
		drag = null;
		render();
	};
	video.addEventListener("pointerup", endDrag);
	video.addEventListener("pointercancel", endDrag);
	if (scale > 1) render();
	return {
		onPinchWheel: event => {
			const rect = video.getBoundingClientRect();
			const cx = event.clientX - (rect.left + rect.width / 2 - x);
			const cy = event.clientY - (rect.top + rect.height / 2 - y);
			zoomAt(rect, cx, cy, Math.exp(-clamp(-25, deltaPx(event), 25) / 100));
		},
		onPanWheel: event => {
			moveTo(video.getBoundingClientRect(), x - event.deltaX * unitPx(event.deltaMode), y - deltaPx(event));
		},
		zoomIn: () => zoomAt(video.getBoundingClientRect(), 0, 0, 1.25),
		zoomOut: () => zoomAt(video.getBoundingClientRect(), 0, 0, 0.8),
		isZoomed: () => scale > 1,
		canZoomIn: () => scale < 4,
		onChange: listener => listeners.add(listener),
		getState: () => ({ scale, x, y }),
	};
}
function attachVideoGestures(video, onRotate, initial) {
	const zoom = zoomAndPan(video, initial);
	attachVideoControls(video, zoom, onRotate);
	video.addEventListener(
		"wheel",
		event => {
			if (event.ctrlKey && isWheelNotch(event)) return;
			event.preventDefault();
			if (event.ctrlKey) {
				if (getSetting("pinchToZoom")) zoom.onPinchWheel(event);
			} else if (zoom.isZoomed()) zoom.onPanWheel(event);
		},
		{ passive: false },
	);
	return zoom;
}

// file://./src/betterbw/features/panelActions.tsx

const BtnClassify = ({ getUsername, panel, value, title, onClick }) =>
	h(
		"button",
		{
			"data-status-value": value,
			title: title,
			className: "panel-action-btn",
			onClick: e => {
				const username = getUsername();
				if (username) GM.setValue(`${username}_status`, value).then(() => refreshDynamicStyle());
				if (panel) panel.dataset.status = value;
				onClick?.(e);
			},
		},
		value,
	);
const BtnMinus2 = ({ getUsername, panel }) =>
	h(BtnClassify, {
		getUsername: getUsername,
		panel: panel,
		value: "--",
		title: "Nope\nDo not suggest this person.",
		onClick: () => {
			if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
		},
	});
const BtnMinus1 = props => h(BtnClassify, { value: "-", title: "So so\nIt depends on the day, on the mood...", ...props });
const BtnPlus1 = props => h(BtnClassify, { value: "+", title: "Yeah\nI liked you, buddy", ...props });
const BtnPlus2 = props => h(BtnClassify, { value: "++", title: "Ohhh Yeah!\nI liked you a lot, buddy!", ...props });
const BtnCooldown = ({ panel, getUsername }) =>
	h(
		"button",
		{
			title: "Cooldown 15m\nDo not suggest this person for the next 15 minutes\n\nShift + click: Cooldown 2h",
			className: "panel-action-btn",
			onClick: event => {
				event?.shiftKey ? cooldownIt({ username: getUsername(), panel, minutes: 120 }) : cooldownIt({ username: getUsername(), panel });
			},
		},
		"⏱",
	);
const PanelActions = ({ panel, username }) => {
	const props = { panel, getUsername: () => username };
	return h(
		Fragment,
		null,
		h("div", { class: "panel-action" }, h(BtnMinus2, props), h(BtnMinus1, props), h(BtnPlus1, props), h(BtnPlus2, props)),
		h("div", { class: "panel-cooldown" }, h(BtnCooldown, props)),
	);
};
const MenuActions = () => {
	const props = { getUsername: getLatestUser };
	return h("div", null, h(BtnCooldown, props), h(BtnPlus2, props), h(BtnPlus1, props), h(BtnMinus1, props), h(BtnMinus2, props));
};
function getLatestUser() {
	const selected = getUserById(chatHTML5.myUser.selectedUserid);
	if (selected) return selected.username;
	const muteItem = $('#userMenu [data-action="mute"]')[0];
	return muteItem?.textContent.split(" ").at(-1)?.split("_").at(0);
}
function resizePanel(panelJS) {
	const { width, height } = computeLayout();
	panelJS.resize({ width, height });
}
function monitorVideoReadiness(video, panel, panelJS) {
	let timeoutId;
	if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) return;
	const cleanup = () => {
		clearTimeout(timeoutId);
		video.removeEventListener("loadeddata", onVideoReady);
	};
	const onVideoReady = () => {
		cleanup();
	};
	const originalClose = panelJS.close.bind(panelJS);
	panelJS.close = function () {
		cleanup();
		return originalClose();
	};
	timeoutId = setTimeout(() => {
		if (!panel.isConnected) return;
		cooldownIt({ username: scrappers_getUsername(panel), minutes: 5 });
		panelJS.close();
	}, 25000);
	video.addEventListener("loadeddata", onVideoReady);
}
async function attachPanelActions(panel) {
	if ("1" === panel.dataset.actionsAttached) return;
	panel.dataset.actionsAttached = "1";
	const panelJS = jsPanel.activePanels.getPanel(panel.id);
	if (!panelJS) return;
	resizePanel(panelJS);
	const header = $(".jsPanel-hdr .jsPanel-title", panel)[0];
	if (!header) return;
	const username = scrappers_getUsername(panel);
	if (!username) return;
	panel.dataset.username = username;
	panel.dataset.status = await GM.getValue(`${username}_status`);
	const actions = document.createElement("div");
	header.appendChild(actions);
	preact.render(h(PanelActions, { username: username, panel: panel }), actions);
	panel.dataset.rotation = await GM.getValue(`${username}_rotation`, "0");
	$(".jsPanel-btn.jsPanel-btn-close", panel)
		.attr("title", "Close\n\nShift + click: also reduce the # of cams")
		.on("click", event => {
			if (event.shiftKey) chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber();
			cooldownIt({ username: username, minutes: 1 });
		});
	$(header)
		.attr("title", "Middle click or Ctrl + click: close and reduce the # of cams")
		.on("mousedown", event => {
			if (1 === event.button) event.preventDefault();
		})
		.on("auxclick click", event => {
			if ("auxclick" === event.type ? 1 !== event.button : !event.ctrlKey) return;
			event.preventDefault();
			chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber();
			cooldownIt({ username, minutes: 1, panel });
		});
	$(".userAvatar", panel).on("click", event => {
		event.stopPropagation();
		if (!("pageX" in event && "pageY" in event)) return;
		if ($("#userMenu").is(":visible")) return void $("#userMenu").hide();
		$(`#userList .userItem[data-id=${JSON.stringify(panel.id.split("_")[2])}]`).trigger(
			new jQuery.Event("click", { pageX: event.pageX + 3, pageY: event.pageY }),
		);
	});
	const video = panel.querySelector("video");
	if (video) {
		if (sessionAudioMuted.get(username)) video.muted = true;
		video.volume = await GM.getValue(`${username}_volume`, getSetting("defaultVolume"));
		const zoom = attachVideoGestures(video, () => rotateCam({ id: username, panel }), sessionZoom.get(username));
		zoom.onChange(
			debounce(() => {
				sessionZoom.set(username, zoom.getState());
			}),
		);
		persistVolumeChange(video, username);
		monitorVideoReadiness(video, panel, panelJS);
	}
}
function persistVolumeChange(video, username) {
	video.addEventListener(
		"volumechange",
		debounce(async () => {
			sessionAudioMuted.set(username, video.muted);
			await GM.setValue(`${username}_volume`, video.volume);
		}),
	);
}

// file://./src/betterbw/utils/spyOn.ts
function spyOn(obj, watchers) {
	return Proxy.revocable(obj, {
		set(target, prop, value) {
			if (prop in watchers && target[prop] !== value) watchers[prop](value);
			target[prop] = value;
			return true;
		},
	});
}

// file://./src/betterbw/styles/openPanels.css?raw
const openPanels_css = `
[data-username="I_am_watching"] {
	#userList &.userItem .webcamBtn {
		background: rgba(80, 206, 133, 1) !important;
	}
	#tabs &.userItem:before,
	#tabs & .watchCam:before {
		content: '';
		display: block;
		position: absolute;
		width: 12px;
		height: 11px;
		top: 50%;
		transform: translateY(-50%) translateX(-130%);
		border-radius: 2px;
		border: rgba(178, 178, 178, 1) solid 1px;
		border-top-width: 3px;
	}
}
.jsPanel.watchingMe {
	--gridGap: 4px;
	box-shadow: #FFD700 0px 0px 1px var(--gridGap) !important;
	& .jsPanel-headerbar {
		background: gold;
		background: linear-gradient(gold 0%, transparent 30%, transparent 70%, gold 85%);
	}
	& .jsPanel-title::before {
		content: "👁️";
		content: "\\f06e";
		font-family: "Font Awesome 5 Free";
		font-weight: 400;
		color: gold;
		position: absolute;
		z-index: 1;
		left: -2px;
		top: -5px;
		text-shadow: 1px 1px 0 goldenrod;
		font-size: 14px;
	}
}
.watching_private_cam {
	display: block;
	position: absolute;
	color: red;
	content: ' \\f023';
	font-family: 'Font Awesome 5 Free';
	font-weight: 900;
	top: 1px;
	left: 45px;
}
`;

// file://./src/betterbw/dynamicOpenedStyle.ts

const dynamicOpenedStyle = GM_addStyle("");
function updateCssForOpenedPanels() {
	const opened = queryPanels();
	if (!opened?.length) return;
	const usernames = Array.from(opened)
		.map(panel => scrappers_getUsername(panel))
		.filter(isDefined);
	const selectorsIamWatching = usernames.map(dataUsername).join(",");
	const selectorsWatchingPrivateCams = usernames
		.map(
			id =>
				`body:has(#userList .userItem:where(${dataUsername(id)}) .webcamBtn.visible i.lock.fa-lock) .jsPanel[data-username="${id}"] .jsPanel-title>span:before`,
		)
		.join(",");
	dynamicOpenedStyle.innerHTML = openPanels_css.replace(/(\.watching_private_cam|\[data-username="I_am_watching"\])/g, arg => {
		switch (arg) {
			case ".watching_private_cam":
				return selectorsWatchingPrivateCams;
			case '[data-username="I_am_watching"]':
				return selectorsIamWatching;
			default:
				return arg;
		}
	});
}

// file://./src/betterbw/features/tabFocus.ts
const tabFocused = () => "visible" === document.visibilityState;
const whenTabFocused = callback => {
	document.addEventListener(
		"visibilitychange",
		() => {
			"visible" === document.visibilityState && callback();
		},
		{ once: true, passive: true },
	);
};

// file://./src/betterbw/utils/observeIt.ts
function iterate(nodes, selector, fn) {
	let found = false;
	for (const node of nodes) {
		if (!(node instanceof HTMLElement)) continue;
		const panels = node.matches(selector) ? [node] : node.querySelectorAll(selector);
		if (panels.length) {
			if (fn) panels.forEach(fn);
			found = true;
		}
	}
	return found;
}
function observeIt({ target, selector, forEachAddedNode, forEachRemovedNode, cleanup }) {
	const observerPanels = new MutationObserver(mutations => {
		let nodesAdded = false;
		let nodesRemoved = false;
		for (const mutation of mutations) {
			if (iterate(mutation.addedNodes, selector, forEachAddedNode)) nodesAdded = true;
			if (iterate(mutation.removedNodes, selector, forEachRemovedNode)) nodesRemoved = true;
		}
		cleanup?.({ nodesAdded, nodesRemoved });
	});
	observerPanels.observe(target, { childList: true, subtree: false });
	return {
		teardown: () => {
			observerPanels.disconnect();
		},
	};
}

const { useState, useEffect, useRef } = window.preactHooks;

// file://./src/betterbw/features/globalActions.tsx

const ALGO_DESCRIPTIONS = {
	top: { label: "Top", description: "Prioritize users you liked more" },
	new: { label: "New", description: "Prioritize users you haven't liked/disliked before" },
};
async function runAlgo(preferredAlgo) {
	setAlgo(preferredAlgo);
	openCandidates(await getCandidates(topRandom, "new" === preferredAlgo ? { undefined: 9, "+": 8 } : {}));
}
const clickOnCurrentAlgoButton = debounce(() => {
	const algo = getAlgo();
	if ("new" === algo || "top" === algo) runAlgo(algo);
	else organizePanels();
});
const ResetLayoutButton = () => h("button", { title: "Reset the cams' grid layout", onClick: organizePanels }, "▦");
const PlayPauseButton = () => {
	const [playing, setPlaying] = useState(true);
	return h(
		"button",
		{
			title: playing ? "Stop opening cams automatically" : "Start opening cams automatically",
			onClick: async () => {
				if (playing) {
					setAlgo("");
					organizePanels();
					setPlaying(false);
				} else {
					await runAlgo(getSetting("preferredAlgo"));
					setPlaying(true);
				}
			},
		},
		playing ? "⏸" : "▶",
	);
};
const NumberOfCams = () => {
	const [value, setValue] = useState(() => GM_getValue("user.webcamMax", 10));
	useEffect(() => {
		const maxWebcamreached = chatHTML5.maxWebcamreached;
		chatHTML5.maxWebcamreached = function () {
			if (!maxWebcamreached()) return false;
			chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber() + 1;
			return maxWebcamreached();
		};
		const { proxy, revoke } = spyOn(chatHTML5.roles.user, {
			webcamMax: n => {
				setValue(n);
				GM.setValue("user.webcamMax", n);
			},
		});
		chatHTML5.roles.user = proxy;
		return () => {
			chatHTML5.maxWebcamreached = maxWebcamreached;
			revoke();
		};
	}, []);
	useEffect(() => {
		clickOnCurrentAlgoButton();
	}, [value]);
	return h(
		"label",
		null,
		h("input", {
			title: "# of open cams",
			type: "number",
			className: "numberOfCams",
			value: value,
			onChange: e => {
				chatHTML5.roles.user.webcamMax = +e.currentTarget.value;
			},
		}),
	);
};

// file://./src/betterbw/features/watchingMe.ts

function markPanelsWatchingMe() {
	for (const panel of queryPanels()) {
		const id = getUserId(panel);
		panel.classList.toggle("watchingMe", Boolean(id && id in chatHTML5.watchingAtMe));
	}
}
async function notifyWatching(user) {
	const mode = getSetting("watchNotifications");
	if ("off" === mode) return;
	const username = user.username.split("_")[0];
	const status = await GM.getValue(`${username}_status`);
	if ("--" === status) return;
	if ("plusplus" === mode && "++" !== status) return;
	if ("liked" === mode && "+" !== status && "++" !== status) return;
	const label = `<span class="userLabelBBW" data-username="${escapeHtml(username)}">${escapeHtml(username)}</span>`;
	chatHTML5.serverMessageCurrentTab(`👁 ${label} started watching you`, "bbw-watch-notice");
}
function setupWatchingMe() {
	const notified = new Set();
	markPanelsWatchingMe();
	chatHTML5.socket.on("watched", (user, watching) => {
		markPanelsWatchingMe();
		const id = String(user.id);
		if (watching) {
			if (id !== String(chatHTML5.myUser.id) && !notified.has(id)) {
				notified.add(id);
				notifyWatching(user);
			}
		} else notified.delete(id);
	});
}

// file://./src/betterbw/features/camCleanup.ts

const recentlyStopped = new Set();
function markStopped(id) {
	recentlyStopped.add(id);
	setTimeout(() => recentlyStopped.delete(id), 2000);
}
function detach(media) {
	media.pause();
	media.srcObject = null;
}
const cc_hasPanel = id => Array.from(queryPanels()).some(panel => getUserId(panel) === id);
function stopWatching(id, why) {
	if (recentlyStopped.has(id)) return;
	chatHTML5.socket.emit("watch", chatHTML5.myUser.id, id, false);
	try {
		chatHTML5.removeWebcam(id, "bbw-cleanup");
	} catch (error) {}
}
function getMediaUserId(media) {
	const [, prefix, id] = media.id.match(/^(video_|remotevideo)(\d+)$/) ?? [];
	if (!id || "video_" === prefix) return id;
	const user = Object.values(chatHTML5.users).find(user => String(user.streamid ?? user.id) === id);
	return user ? String(user.id) : id;
}
function setupCamCleanup() {
	const { removeWebcam } = chatHTML5;
	chatHTML5.removeWebcam = (id, reason) => {
		markStopped(String(id));
		return removeWebcam(id, reason);
	};
	const play = HTMLMediaElement.prototype.play;
	HTMLMediaElement.prototype.play = function () {
		if (this.isConnected || !this.srcObject) return play.call(this);
		const id = getMediaUserId(this);
		if (id && cc_hasPanel(id)) return play.call(this);
		detach(this);
		if (id) stopWatching(id, "it connected after its panel closed");
		return Promise.resolve();
	};
}
function cleanupClosedCam(panel) {
	panel.querySelectorAll("video, audio").forEach(detach);
	const id = getUserId(panel);
	if (id && !cc_hasPanel(id)) stopWatching(id, "its panel closed");
}

// file://./src/betterbw/styles/camsMoveAway.css?raw
const cma_css = `
.jsPanel {
	translate: var(--bbw-peek-x, 0px) var(--bbw-peek-y, 0px);
}
.jsPanel:is(.ui-draggable-dragging, .bbw-dragging) {
	translate: none;
}
.jsPanel.bbw-peeking {
	z-index: 99 !important;
}
`;

// file://./src/betterbw/features/camsMoveAway.ts

const rectOf = (left, top, right, bottom) => new DOMRect(left, top, right - left, bottom - top);
const contains = (rect, x, y) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
const panelRects = () => Array.from(queryPanels(), panel => [panel, panel.getBoundingClientRect()]);
const PEEKING_CLASS = "bbw-peeking";
function startPanel(panel, property, shift) {
	panel.style.setProperty(property, `${shift}px`);
	panel.classList.add(PEEKING_CLASS);
}
function endPeek(peek, instant) {
	if (!peek) return null;
	for (const panel of peek.panels) {
		if (instant) panel.style.transition = "none";
		panel.style.removeProperty(peek.property);
		panel.classList.remove(PEEKING_CLASS);
	}
	if (instant && peek.panels[0]) {
		peek.panels[0].offsetHeight;
		for (const panel of peek.panels) panel.style.transition = "";
	}
	return null;
}
const sides = [
	{
		zone: function tabsZone() {
			const chat = document.getElementById("tabsAndFooter")?.getBoundingClientRect();
			if (!chat?.width) return null;
			const tabs = document.querySelector("#tabs .nav-tabs:not(.nav-tabs-clone)")?.getBoundingClientRect();
			return rectOf(chat.left, 0, chat.right, tabs?.bottom || 65);
		},
		start: function startTabsPeek(zone) {
			const covering = panelRects().filter(([, rect]) => rect.left < zone.right && rect.right > zone.left && rect.top < zone.bottom);
			if (!covering.length) return null;
			const shift = Math.max(...covering.map(([, rect]) => zone.bottom - rect.top)) + 4;
			for (const [panel] of covering) startPanel(panel, "--bbw-peek-y", shift);
			const left = Math.min(zone.left, ...covering.map(([, rect]) => rect.left));
			const right = Math.max(zone.right, ...covering.map(([, rect]) => rect.right));
			return { panels: covering.map(([panel]) => panel), property: "--bbw-peek-y", hold: rectOf(left, zone.top, right, zone.bottom + shift) };
		},
		peek: null,
		timer: null,
	},
	{
		zone: function sidebarZone() {
			const sidebar = document.getElementById("usersContainer")?.getBoundingClientRect();
			return sidebar?.width ? sidebar : null;
		},
		start: function startSidebarPeek(zone) {
			const covering = panelRects().filter(([, rect]) => rect.left < zone.right && rect.right > zone.left && rect.top < zone.bottom && rect.bottom > zone.top);
			if (!covering.length) return null;
			const hugsRight = zone.left > innerWidth - zone.right;
			const needed = Math.max(...covering.map(([, rect]) => (hugsRight ? rect.right - zone.left : zone.right - rect.left)));
			const shift = (hugsRight ? -1 : 1) * (needed + 4);
			for (const [panel] of covering) startPanel(panel, "--bbw-peek-x", shift);
			const top = Math.min(zone.top, ...covering.map(([, rect]) => rect.top));
			const bottom = Math.max(zone.bottom, ...covering.map(([, rect]) => rect.bottom));
			return {
				panels: covering.map(([panel]) => panel),
				property: "--bbw-peek-x",
				hold: rectOf(Math.min(zone.left, zone.left + shift), top, Math.max(zone.right, zone.right + shift), bottom),
			};
		},
		peek: null,
		timer: null,
	},
];
let enabled = true;
let pointerX = -1;
let pointerY = -1;
let onPanel = null;
let cma_frame = 0;
function cancelDwell(side) {
	if (side.timer) clearTimeout(side.timer);
	side.timer = null;
}
function endPeeks(instant = false) {
	for (const side of sides) {
		cancelDwell(side);
		side.peek = endPeek(side.peek, instant);
	}
}
const readyIn = zone => !onPanel && contains(zone, pointerX, pointerY);
function cma_step(side) {
	if (side.peek) {
		let peek;
		if (!(contains((peek = side.peek).hold, pointerX, pointerY) || (!!onPanel && peek.panels.includes(onPanel)))) side.peek = endPeek(side.peek, false);
		return;
	}
	const zone = side.zone();
	if (!zone || !readyIn(zone)) return cancelDwell(side);
	if (side.timer) return;
	side.timer = setTimeout(() => {
		side.timer = null;
		const zone = side.zone();
		if (zone && readyIn(zone)) side.peek = side.start(zone);
	}, 250);
}
function update() {
	cma_frame = 0;
	if (enabled) for (const side of sides) cma_step(side);
}
function onMouseMove(event) {
	if (event.buttons) return;
	pointerX = event.clientX;
	pointerY = event.clientY;
	onPanel = event.target instanceof Element ? event.target.closest(PANEL_SELECTOR) : null;
	if (!cma_frame) cma_frame = requestAnimationFrame(update);
}
function onPointerDown(event) {
	let target;
	for (const side of sides) cancelDwell(side);
	if (
		0 === event.button
		&& event.target instanceof Element
		&& !!(target = event.target).closest(".jsPanel-hdr")
		&& !target.closest("button, input, a, .jsPanel-btn, .userAvatar")
	)
		endPeeks(true);
}
function refreshCamsMoveAway() {
	enabled = getSetting("camsMoveAway");
	if (!enabled) endPeeks();
}
function setupCamsMoveAway() {
	GM.addStyle(cma_css);
	refreshCamsMoveAway();
	document.addEventListener("pointerdown", onPointerDown, true);
	document.addEventListener("mousemove", onMouseMove, { capture: true, passive: true });
	document.documentElement.addEventListener("mouseleave", () => endPeeks());
	addEventListener("blur", () => endPeeks());
	addEventListener("resize", () => endPeeks());
}

// file://./src/betterbw/features/observeOpenPanels.ts

let oop_nextUser = null;
const setNextCam = val => (oop_nextUser = val);
let clickRequested = false;
function observePanels() {
	return observeIt({
		target: document.body,
		selector: PANEL_SELECTOR,
		forEachAddedNode: attachPanelActions,
		forEachRemovedNode: cleanupClosedCam,
		cleanup: ({ nodesAdded, nodesRemoved }) => {
			if (!nodesAdded && !nodesRemoved) return;
			endPeeks();
			organizePanels();
			if (nodesRemoved) {
				if (oop_nextUser) {
					clickWebcamButton($(".webcamBtn.visible", oop_nextUser));
					oop_nextUser = null;
				} else if (tabFocused()) clickOnCurrentAlgoButton();
				else if (!clickRequested) {
					clickRequested = true;
					whenTabFocused(() => {
						clickRequested = false;
						clickOnCurrentAlgoButton();
					});
				}
			}
			updateCssForOpenedPanels();
			markPanelsWatchingMe();
		},
	});
}

// file://./src/betterbw/features/discovery.tsx

const SEEN_KEY = "discovery.headerControlsMoved";
function HeaderControlsDiscovery() {
	const [seen, setSeen] = useState(() => GM_getValue(SEEN_KEY, false));
	if (seen) return null;
	const dismiss = () => {
		GM.setValue(SEEN_KEY, true);
		setSeen(true);
	};
	return h("div", { class: "bbw-discovery", onClick: dismiss }, "Better BW's controls moved here", h("button", { onClick: dismiss }, "Got it"));
}

// file://./src/betterbw/features/spyOnConfig.ts

function spyOnConfig(watchers = {}) {
	const { proxy, revoke } = spyOn(chatHTML5.config, watchers);
	chatHTML5.config = proxy;
	return { proxy, revoke, watchers };
}

// file://./src/betterbw/features/watchStats.ts

const STORAGE_KEY = "stats.watchingMe";
const PEAK_KEYS = ["watchers", "onCam", "mutual", "roomShare", "camsShare"];
const emptyPeaks = () => Object.fromEntries(PEAK_KEYS.map(key => [key, { value: 0, at: 0 }]));
const emptyUnsaved = () => ({ watchedMs: 0, watcherMs: 0, sessions: 0, regulars: {}, watchTime: {} });
const emptyEver = () => ({ ...emptyUnsaved(), peaks: emptyPeaks(), since: Date.now() });
let ws_now = { watchers: 0, onCam: 0, mutual: 0, roomShare: 0, camsShare: 0, names: [] };
const ws_session = { watchedMs: 0, watcherMs: 0, peaks: emptyPeaks(), watchers: new Set() };
let ws_ever = emptyEver();
let unsaved = emptyUnsaved();
let ws_dirty = false;
let ws_paused = false;
let lastTickAt = Date.now();
let savedAt = Date.now();
const ws_listeners = new Set();
function subscribeWatchStats(listener) {
	ws_listeners.add(listener);
	return () => {
		ws_listeners.delete(listener);
	};
}
const getWatchStats = () => ({ now: ws_now, session: ws_session, ever: ws_ever, paused: ws_paused });
const isTransmitting = () => true === chatHTML5.myUser.webcam;
function isMainTabActive() {
	const tab = document.querySelector('[data-label="Bateworld"]');
	if (!tab) return false;
	return tab.matches('.active, [aria-selected="true"]') || Boolean(tab.parentElement?.matches("li.active"));
}
function takeSnapshot() {
	const me = String(chatHTML5.myUser.id);
	const userById = id => chatHTML5.users[id] ?? chatHTML5.watchingAtMe[id];
	const watcherIds = Object.keys(chatHTML5.watchingAtMe).filter(id => id !== me);
	const watchers = watcherIds.length;
	const names = [...new Set(watcherIds.map(id => userById(id)?.username?.split("_")[0]).filter(isDefined))];
	const onCam = watcherIds.filter(id => userById(id)?.webcam).length;
	const watching = new Set(Array.from(queryPanels(), getUserId));
	const mutual = watcherIds.filter(id => watching.has(id)).length;
	const othersOnline =
		(Number(document.querySelector("#onlineCounter")?.textContent?.trim()) || 0 || document.querySelectorAll("#userList .userItem").length) - 1;
	const othersOnCam = Object.values(chatHTML5.users).filter(user => user.webcam && String(user.id) !== me).length;
	return { watchers, onCam, mutual, roomShare: othersOnline > 0 ? watchers / othersOnline : 0, camsShare: othersOnCam > 0 ? onCam / othersOnCam : 0, names };
}
function record(at) {
	ws_now = takeSnapshot();
	if (ws_now.watchers > 0 && 0 === ws_session.peaks.watchers.value) {
		ws_ever.sessions++;
		unsaved.sessions++;
	}
	for (const key of PEAK_KEYS) {
		const value = ws_now[key];
		if (value > ws_session.peaks[key].value) ws_session.peaks[key] = { value, at };
		if (value > ws_ever.peaks[key].value) {
			ws_ever.peaks[key] = { value, at };
			ws_dirty = true;
		}
	}
	for (const name of ws_now.names)
		if (!ws_session.watchers.has(name)) {
			ws_session.watchers.add(name);
			ws_ever.regulars[name] = (ws_ever.regulars[name] ?? 0) + 1;
			unsaved.regulars[name] = (unsaved.regulars[name] ?? 0) + 1;
		}
}
function tick() {
	const at = Date.now();
	if (!ws_paused && ws_now.watchers > 0) {
		for (const totals of [ws_session, ws_ever, unsaved]) {
			totals.watchedMs += at - lastTickAt;
			totals.watcherMs += ws_now.watchers * (at - lastTickAt);
		}
		for (const name of ws_now.names)
			for (const watchTime of [ws_ever.watchTime, unsaved.watchTime]) watchTime[name] = (watchTime[name] ?? 0) + (at - lastTickAt);
		ws_dirty = true;
	}
	lastTickAt = at;
	ws_paused = !isMainTabActive();
	if (!ws_paused) record(at);
	if (ws_dirty && at - savedAt > 15000) save();
	ws_listeners.forEach(listener => listener());
}
async function load() {
	const stored = await GM.getValue(STORAGE_KEY);
	const empty = emptyEver();
	return { ...empty, ...stored, peaks: { ...empty.peaks, ...stored?.peaks } };
}
function addCounts(base, pending) {
	const sum = { ...base };
	for (const [name, count] of Object.entries(pending)) sum[name] = (sum[name] ?? 0) + count;
	return sum;
}
function merge(base, pending, peaks) {
	return {
		since: base.since,
		peaks: Object.fromEntries(PEAK_KEYS.map(key => [key, peaks[key].value > base.peaks[key].value ? peaks[key] : base.peaks[key]])),
		watchedMs: base.watchedMs + pending.watchedMs,
		watcherMs: base.watcherMs + pending.watcherMs,
		sessions: base.sessions + pending.sessions,
		regulars: addCounts(base.regulars, pending.regulars),
		watchTime: addCounts(base.watchTime, pending.watchTime),
	};
}
async function save() {
	ws_dirty = false;
	savedAt = Date.now();
	const pending = unsaved;
	unsaved = emptyUnsaved();
	const saved = merge(await load(), pending, ws_ever.peaks);
	await GM.setValue(STORAGE_KEY, saved);
	ws_ever = merge(saved, unsaved, ws_ever.peaks);
}
async function trackWatchStats() {
	ws_ever = await load();
	lastTickAt = Date.now();
	tick();
	setInterval(tick, 2000);
	chatHTML5.socket.on("watched", () => tick());
	window.addEventListener("pagehide", () => {
		if (ws_dirty) save();
	});
}

// file://./src/betterbw/features/fastUserList.ts
let batching = false;
let listedRoomId = null;
const isSelected = id => document.getElementById(id)?.classList.contains("selected") ?? false;
function sortUserList() {
	if (isSelected("sortWatchersBtn")) return chatHTML5.sortWatchersNumber();
	const byRole = isSelected("sortRoleBtn");
	const byWebcam = isSelected("sortWebcamtBtn");
	const byName = isSelected("sortBtn");
	const list = document.getElementById("userList");
	if (!list || (!byRole && !byWebcam && !byName)) return;
	const flag = (item, key) => Number("true" === item.dataset[key]);
	const items = Array.from(list.children);
	items.sort(
		(a, b) =>
			flag(b, "showtop") - flag(a, "showtop")
			|| (byRole ? Number(b.dataset.power) - Number(a.dataset.power) : 0)
			|| (byWebcam ? flag(b, "webcam") - flag(a, "webcam") : 0)
			|| (byName ? (a.dataset.username ?? "").localeCompare(b.dataset.username ?? "", void 0, { sensitivity: "base" }) : 0),
	);
	list.append(...items);
}
function batchUserListRebuilds() {
	const { getUserPositionInList, searchUsers } = chatHTML5;
	chatHTML5.getUserPositionInList = user => {
		if (!batching) return getUserPositionInList(user);
		return chatHTML5.showOnTopofUserList(user) ? 0 : -1;
	};
	chatHTML5.searchUsers = () => {
		if (!batching) searchUsers();
	};
	document.addEventListener("roomChanged", () => {
		batching = true;
		setTimeout(() => {
			batching = false;
			sortUserList();
			searchUsers();
			chatHTML5.updateNumberUsersDisplay();
		});
	});
}
function skipRedundantUserListRefresh() {
	const { socket } = chatHTML5;
	const tab = chatHTML5.getCurrentTab();
	if (tab.room) listedRoomId = String(tab.roomid);
	socket.on("getUsers", (_users, roomid) => {
		listedRoomId = String(roomid);
	});
	$(document).on("tabChanged", (_event, changedTab) => {
		if (changedTab?.room === false && "1" === chatHTML5.config.multiRoomEnter) listedRoomId = null;
	});
	const emit = socket.emit;
	socket.emit = function (event, ...args) {
		if ("getUsers" === event && String(args[0]) === listedRoomId) return this;
		return emit.call(this, event, ...args);
	};
}

// file://./src/betterbw/features/watchStatsDisplay.tsx

const wsd_int = n => Math.round(n).toLocaleString();
const pct = n => `${Math.round(100 * n)}%`;
const average = ({ watchedMs, watcherMs }) => (watchedMs ? (watcherMs / watchedMs).toFixed(1) : "–");
const wsd_date = at => new Date(at).toLocaleString(void 0, { dateStyle: "medium", timeStyle: "short" });
function duration(ms) {
	const minutes = Math.floor(ms / 60000);
	if (minutes < 1) return `${Math.floor(ms / 1000)}s`;
	if (minutes < 60) return `${minutes}m`;
	return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
const PEAK_ROWS = [
	["watchers", "Watching you", wsd_int],
	["onCam", "…with their cam on", wsd_int],
	["mutual", "…whose cam you watch", wsd_int],
	["roomShare", "Share of the room", pct],
	["camsShare", "Share of the cams", pct],
];
function StatsCard({ anchor }) {
	const { now, session, ever, paused } = getWatchStats();
	const below = anchor.bottom + 340 < innerHeight;
	const style = {
		width: "330px",
		left: `max(8px, min(${anchor.left}px, calc(100vw - 338px)))`,
		top: `${below ? anchor.bottom + 6 : anchor.top - 6}px`,
		transform: below ? "" : "translateY(-100%)",
	};
	const regulars = Object.entries(ever.watchTime)
		.filter(([, ms]) => ms >= 60000)
		.sort(([, a], [, b]) => b - a)
		.slice(0, 5);
	return h(
		"div",
		{ class: "bbw-watch-card", style: style },
		h(
			"table",
			null,
			h("thead", null, h("tr", null, h("th", null), h("th", null, "Now"), h("th", null, "Session"), h("th", null, "Ever"))),
			h(
				"tbody",
				null,
				PEAK_ROWS.map(([key, label, format]) =>
					h(
						"tr",
						{ key: key },
						h("th", null, label),
						h("td", null, paused ? "–" : format(now[key])),
						h("td", null, format(session.peaks[key].value)),
						h("td", null, format(ever.peaks[key].value)),
					),
				),
				h(
					"tr",
					{ class: "bbw-separator" },
					h("th", null, "Unique watchers"),
					h("td", null),
					h("td", null, wsd_int(session.watchers.size)),
					h("td", null, wsd_int(Object.keys(ever.regulars).length)),
				),
				h("tr", null, h("th", null, "Watched for"), h("td", null), h("td", null, duration(session.watchedMs)), h("td", null, duration(ever.watchedMs))),
				h("tr", null, h("th", null, "Average watchers"), h("td", null), h("td", null, average(session)), h("td", null, average(ever))),
			),
		),
		paused && h("p", null, h("b", null, "Paused:"), " only counted while the Bateworld tab is open"),
		h("p", { class: "bbw-muted" }, "Top rows: the most at once. Averages count only the time someone was watching."),
		ever.peaks.watchers.at > 0
			&& h(
				"p",
				null,
				"Record: ",
				h("b", null, wsd_int(ever.peaks.watchers.value)),
				" watchers, on ",
				wsd_date(ever.peaks.watchers.at),
			),
		regulars.length > 0
			&& h("p", null, "Regulars: ", regulars.map(([name, ms]) => `${name} (${duration(ms)}, ${wsd_int(ever.regulars[name] ?? 1)}×)`).join(", ")),
		h("p", { class: "bbw-muted" }, "Watched in ", wsd_int(ever.sessions), " sessions since ", wsd_date(ever.since)),
	);
}
function WatchStats() {
	const [, setVersion] = useState(0);
	useEffect(() => subscribeWatchStats(() => setVersion(v => v + 1)), []);
	const [anchor, setAnchor] = useState(null);
	const { session, ever } = getWatchStats();
	const showSession = isTransmitting() || session.peaks.watchers.value > 0;
	return h(
		"span",
		{ class: "bbw-watch-stats", onMouseEnter: e => setAnchor(e.currentTarget.getBoundingClientRect()), onMouseLeave: () => setAnchor(null) },
		h(
			"span",
			{ class: "bbw-watch-summary" },
			"max ",
			wsd_int(ever.peaks.watchers.value),
			showSession && ` · session ${wsd_int(session.peaks.watchers.value)}`,
		),
		anchor && h(StatsCard, { anchor: anchor }),
	);
}

// file://./src/betterbw/features/settingsMenu.tsx

const NOTIFICATIONS = [
	["off", "Off"],
	["plusplus", "Only ++"],
	["liked", "Buddies you liked (+, ++)"],
	["all", "Everyone (except --)"],
];
const GROUPS = [...new Set(SITE_OPTIONS.map(option => option.group))];
const START_MUTED_OPTION = SITE_OPTIONS.find(option => "soundMutedAtStart" === option.key);
function SiteOptionInput({ option, onChange }) {
	const value = String(chatHTML5.config[option.key] ?? "");
	if ("number" === option.type)
		return h(
			"label",
			null,
			option.label,
			h("input", {
				type: "number",
				min: "0",
				value: value || "0",
				onChange: e => {
					setSiteOption(option.key, String(Math.max(0, parseInt(e.currentTarget.value) || 0)));
					onChange();
				},
			}),
			option.unit,
		);
	return h(
		"label",
		null,
		h("input", {
			type: "checkbox",
			checked: "1" === value,
			onChange: e => {
				setSiteOption(option.key, e.currentTarget.checked ? "1" : "0");
				onChange();
			},
		}),
		option.label,
	);
}
function VolumePercentInput() {
	const [percent, setPercent] = useState(() => Math.round(100 * getSetting("defaultVolume")));
	return h(
		"label",
		null,
		"Default volume for new cams",
		h("input", {
			type: "number",
			min: "0",
			max: "100",
			value: percent,
			onChange: e => {
				const value = Math.min(100, Math.max(0, parseInt(e.currentTarget.value) || 0));
				setPercent(value);
				setSetting("defaultVolume", value / 100);
			},
		}),
		"%",
	);
}
function ToggleSetting({ setting, label, explain, onChange }) {
	const [checked, setChecked] = useState(() => getSetting(setting));
	return h(
		Fragment,
		null,
		h(
			"label",
			null,
			h("input", {
				type: "checkbox",
				checked: checked,
				onChange: async e => {
					const value = e.currentTarget.checked;
					setChecked(value);
					await setSetting(setting, value);
					onChange?.();
				},
			}),
			label,
		),
		explain && h("span", { class: "bbw-explain" }, explain),
	);
}
function MemoInput({ storageKey, prefix, suffix, defaultValue, onChangeEffect, ...props }) {
	const [value, setValue] = useState(() => GM_getValue(storageKey, defaultValue));
	return h(
		"label",
		null,
		prefix,
		h("input", {
			...props,
			value: value,
			onChange: e => {
				const value = e.currentTarget.value;
				setValue(value);
				GM.setValue(storageKey, value);
				onChangeEffect(value);
			},
		}),
		suffix,
	);
}
function PanelSizeInput() {
	return h(
		"label",
		{ class: "bbw-stacked" },
		"Max size of the panel",
		h(MemoInput, {
			storageKey: "config.webcamWidth",
			type: "number",
			className: "numberOfCams",
			suffix: "px",
			min: "150",
			step: "5",
			defaultValue: gridconf.WIDTH,
			onChangeEffect: value => {
				gridconf.WIDTH = +value;
				gridconf.HEIGHT = value * panelRatio;
				clickOnCurrentAlgoButton();
			},
		}),
		h("span", { class: "bbw-explain" }, "Shrinks automatically when the cams don't fit the screen"),
	);
}
function AlgoSelect() {
	const [value, setValue] = useState(() => getSetting("preferredAlgo"));
	return h(
		"label",
		{ class: "bbw-stacked" },
		"Which cams to prioritize",
		h(
			"select",
			{
				value: value,
				onChange: e => {
					const next = e.currentTarget.value;
					setValue(next);
					setSetting("preferredAlgo", next);
					if ("" !== getAlgo()) runAlgo(next);
				},
			},
			Object.keys(ALGO_DESCRIPTIONS).map(key => h("option", { key: key, value: key }, ALGO_DESCRIPTIONS[key].label)),
		),
		h("span", { class: "bbw-explain" }, ALGO_DESCRIPTIONS[value].description),
	);
}
function ClassicWidthInput() {
	const [width, setWidth] = useState(() => getSetting("classicWidth"));
	return h(
		"label",
		{ class: "bbw-stacked" },
		"Exact size of the panel",
		h(
			"span",
			null,
			h("input", {
				type: "number",
				min: "150",
				step: "5",
				value: width,
				onChange: async e => {
					const value = Math.max(150, parseInt(e.currentTarget.value) || 0);
					setWidth(value);
					await setSetting("classicWidth", value);
					organizePanels();
				},
			}),
			" ",
			"px",
		),
		h("span", { class: "bbw-explain" }, "Every cam is exactly this wide, whatever the size of the window"),
	);
}
function RowsSelect() {
	const [rows, setRows] = useState(() => getSetting("adaptableRows"));
	return h(
		"label",
		{ class: "bbw-stacked" },
		"Rows",
		h(
			"select",
			{
				value: rows,
				onChange: async e => {
					const value = +e.currentTarget.value;
					setRows(value);
					await setSetting("adaptableRows", value);
					organizePanels();
				},
			},
			Array.from({ length: MAX_ROWS }, (_, i) => i + 1).map(n => h("option", { key: n, value: n }, n)),
		),
		h("span", { class: "bbw-explain" }, "The cams grow or shrink so this many rows fill the window's height"),
	);
}
function LayoutOptions({ layout }) {
	if ("classic" === layout) return h(ClassicWidthInput, null);
	return h(Fragment, null, h(RowsSelect, null), h(PanelSizeInput, null));
}
function LayoutSettings() {
	const [applied, setApplied] = useState(() => getSetting("layout"));
	const [selected, setSelected] = useState(applied);
	const dirty = selected !== applied;
	return h(
		"div",
		null,
		h(
			"div",
			{ class: `bbw-stacked bbw-layout-picker${dirty ? " bbw-dirty" : ""}` },
			h(
				"span",
				null,
				"Layout",
				dirty
					&& h(
						Fragment,
						null,
						" (current: ",
						h(
							"a",
							{
								href: "#",
								title: "Go back to the current layout",
								onClick: e => {
									e.preventDefault();
									setSelected(applied);
								},
							},
							LAYOUT_LABELS[applied],
						),
						")",
					),
			),
			h(
				"div",
				{ class: "bbw-layout-row" },
				h(
					"select",
					{ "aria-label": "Layout", value: selected, onChange: e => setSelected(e.currentTarget.value) },
					Object.keys(LAYOUT_LABELS).map(name => h("option", { key: name, value: name }, LAYOUT_LABELS[name])),
				),
				dirty
					&& h(
						"button",
						{
							type: "button",
							class: "bbw-apply-layout",
							onClick: async () => {
								await setSetting("layout", selected);
								setApplied(selected);
								organizePanels();
							},
						},
						"Apply layout",
					),
			),
			dirty
				&& h(
					"span",
					{ class: "bbw-explain" },
					"Switching layouts rearranges every cam, so it waits for this button. Everything else here saves and applies on its own.",
				),
		),
		h(ToggleSetting, {
			setting: "camsMoveAway",
			label: "Cams move away",
			explain: "Rest the pointer on the chat's tabs, or on the buddy list, and the cams in front of them slide out of the way",
			onChange: refreshCamsMoveAway,
		}),
		h(
			"fieldset",
			null,
			h("legend", null, LAYOUT_LABELS[selected]),
			h(LayoutOptions, { key: selected, layout: selected }),
			dirty && h("p", { class: "bbw-muted" }, "Saved already; used once you apply this layout."),
		),
	);
}
function SettingsPanel({ anchor }) {
	const [notifications, setNotifications] = useState(() => getSetting("watchNotifications"));
	const [, setVersion] = useState(0);
	const rerender = () => setVersion(v => v + 1);
	const style = {
		width: "640px",
		maxWidth: "calc(100vw - 16px)",
		maxHeight: `calc(100vh - ${anchor.bottom + 12}px)`,
		overflowY: "auto",
		top: `${anchor.bottom + 4}px`,
		left: `max(8px, min(${anchor.left}px, calc(100vw - 648px)))`,
	};
	return h(
		"div",
		{ class: "bbw-settings-panel", style: style },
		h("h4", null, "Better BW"),
		h(
			"div",
			{ class: "bbw-settings-columns" },
			h(
				"div",
				null,
				h(
					"label",
					{ class: "bbw-stacked" },
					"Tell me when someone starts watching me",
					h(
						"select",
						{
							value: notifications,
							onChange: e => {
								const value = e.currentTarget.value;
								setNotifications(value);
								setSetting("watchNotifications", value);
							},
						},
						NOTIFICATIONS.map(([value, label]) => h("option", { key: value, value: value }, label)),
					),
				),
				GROUPS.map(group =>
					h(
						"fieldset",
						{ key: group },
						h("legend", null, group),
						SITE_OPTIONS.filter(option => option.group === group && option !== START_MUTED_OPTION).map(option =>
							h(SiteOptionInput, { key: option.key, option: option, onChange: rerender }),
						),
						"Cams" === group
							&& h(
								Fragment,
								null,
								h(AlgoSelect, null),
								h(VolumePercentInput, null),
								h(SiteOptionInput, { option: START_MUTED_OPTION, onChange: rerender }),
								h(ToggleSetting, { setting: "scrollToVolume", label: "Scroll wheel changes the volume" }),
								h(ToggleSetting, { setting: "pinchToZoom", label: "Pinch (or Ctrl + scroll) zooms into the cam" }),
							),
					),
				),
				h("p", { class: "bbw-muted" }, "The chat's options apply to new messages, buddies and cams."),
			),
			h(LayoutSettings, null),
		),
	);
}
function SettingsMenu() {
	const [anchor, setAnchor] = useState(null);
	const [pinned, setPinned] = useState(false);
	const root = useRef(null);
	const closeTimer = useRef();
	const open = () => {
		clearTimeout(closeTimer.current);
		if (root.current) setAnchor(root.current.getBoundingClientRect());
	};
	const close = () => {
		clearTimeout(closeTimer.current);
		setAnchor(null);
		setPinned(false);
	};
	useEffect(() => {
		if (!anchor) return;
		const closeOnEscape = event => {
			if ("Escape" === event.key) close();
		};
		document.addEventListener("keydown", closeOnEscape);
		return () => document.removeEventListener("keydown", closeOnEscape);
	}, [anchor]);
	useEffect(() => {
		if (!pinned) return;
		const closeOnOutsideClick = event => {
			if (!root.current?.contains(event.target)) close();
		};
		document.addEventListener("mousedown", closeOnOutsideClick);
		return () => document.removeEventListener("mousedown", closeOnOutsideClick);
	}, [pinned]);
	return h(
		"span",
		{
			class: "bbw-settings",
			ref: root,
			onMouseEnter: open,
			onMouseLeave: () => {
				if (pinned) return;
				clearTimeout(closeTimer.current);
				closeTimer.current = setTimeout(() => setAnchor(null), 200);
			},
		},
		h(
			"button",
			{
				title: "Better BW settings",
				onClick: () => {
					if (pinned) close();
					else {
						open();
						setPinned(true);
					}
				},
			},
			"⚙",
		),
		anchor && h(SettingsPanel, { anchor: anchor }),
	);
}

// file://./src/betterbw/styles/watchStats.css?raw
const ws_css = `
#bbw_watch_stats {
	display: block;
	flex-basis: 100%;
}
.users-info {
	padding-block: 0 !important;
}
.watchingMeContainer:has(#bbw_watch_stats) {
	flex-wrap: wrap;
	line-height: 1;
	label[for="whoWatchesMeCheckbox"] {
		margin-bottom: 0;
	}
}
.bbw-watch-stats {
	white-space: nowrap;
	cursor: help;
}
.bbw-watch-summary {
	font-size: 0.85em;
	opacity: 0.7;
}
#tabs .bbw-watch-notice {
	color: goldenrod;
}
.bbw-watch-card {
	position: fixed;
	z-index: 100000;
	box-sizing: border-box;
	padding: 8px 10px;
	border-radius: 6px;
	background: rgba(20, 20, 20, 0.95);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	color: #eee;
	font-size: 12px;
	line-height: 1.4;
	white-space: normal;
	text-align: left;
	pointer-events: none;
	table {
		width: 100%;
		border-collapse: collapse;
	}
	th,
	td {
		padding: 1px 0;
		border: none;
		font-weight: normal;
	}
	tbody th {
		opacity: 0.8;
	}
	thead th,
	td {
		padding-left: 10px;
		text-align: right;
		font-variant-numeric: tabular-nums;
	}
	thead th {
		font-weight: 600;
	}
	.bbw-separator > * {
		padding-top: 4px;
		border-top: 1px solid rgba(255, 255, 255, 0.15);
	}
	p {
		margin: 6px 0 0;
	}
	.bbw-muted {
		opacity: 0.6;
		font-size: 11px;
	}
}
`;

// file://./src/betterbw/styles/settings.css?raw
const settings_css = `
.bbw-settings-panel {
	position: fixed;
	z-index: 100000;
	box-sizing: border-box;
	padding: 10px 12px;
	border-radius: 6px;
	background: rgba(20, 20, 20, 0.96);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	color: #eee;
	font-size: 12px;
	line-height: 1.4;
	white-space: normal;
	text-align: left;
	h4 {
		margin: 0 0 8px;
		font-size: 13px;
	}
	fieldset {
		margin: 8px 0 0;
		padding: 0;
		border: none;
	}
	legend {
		width: auto;
		margin: 0 0 2px;
		padding: 0;
		border: none;
		color: inherit;
		font-size: 11px;
		opacity: 0.6;
		text-transform: uppercase;
	}
	label {
		display: flex;
		align-items: center;
		gap: 6px;
		margin: 2px 0;
		color: inherit;
		font-weight: normal;
	}
	.bbw-stacked {
		flex-direction: column;
		align-items: stretch;
	}
	select,
	input[type='number'] {
		color: #111;
	}
	input[type='number'] {
		width: 4em;
	}
	.bbw-muted {
		margin: 8px 0 0;
		font-size: 11px;
		opacity: 0.6;
	}
	.bbw-explain {
		display: block;
		margin-top: 2px;
		font-size: 11px;
		opacity: 0.85;
	}
	.bbw-settings-columns {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
		gap: 0 20px;
	}
	.bbw-layout-picker {
		display: flex;
		a {
			color: #7fc8ff;
			text-decoration: underline;
		}
	}
	.bbw-layout-row {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 4px;
		select {
			flex: 1;
			min-width: 0;
		}
	}
	.bbw-dirty .bbw-layout-row {
		padding: 3px;
		outline: 1px solid #50c180;
	}
	.bbw-apply-layout {
		padding: 2px 10px;
		border: none;
		border-radius: 4px;
		background: #50c180;
		color: #111;
		font-weight: 600;
		white-space: nowrap;
		cursor: pointer;
	}
}
.bbw-discovery {
	position: absolute;
	z-index: 100000;
	top: 100%;
	left: 0;
	margin-top: 8px;
	padding: 8px 10px;
	border-radius: 6px;
	background: rgba(20, 20, 20, 0.96);
	box-shadow: 0 4px 16px rgba(0, 0, 0, 0.4);
	color: #eee;
	font-size: 12px;
	line-height: 1.4;
	white-space: nowrap;
	cursor: pointer;
	&:before {
		content: '';
		position: absolute;
		bottom: 100%;
		left: 16px;
		border: 6px solid transparent;
		border-bottom-color: rgba(20, 20, 20, 0.96);
	}
	button {
		margin-left: 8px;
		padding: 2px 8px;
		border-radius: 4px;
		border: none;
		background: #50c180;
		color: #111;
		cursor: pointer;
	}
}
`;

// file://./src/betterbw/setupTools.tsx

async function setupHeader() {
	const avatar = document.getElementById("myAvatar");
	if (!avatar) return;
	const controls = document.createElement("div");
	controls.id = "bbw_header_controls";
	avatar.after(controls);
	GM.addStyle(settings_css);
	preact.render(
		h(Fragment, null, h(SettingsMenu, null), h(ResetLayoutButton, null), h(NumberOfCams, null), h(PlayPauseButton, null), h(HeaderControlsDiscovery, null)),
		controls,
	);
}
async function setupUserMenu() {
	const userMenu = $("#userMenu")[0];
	if (!userMenu) return;
	const controls = document.createElement("div");
	controls.id = "bbw_menu_controls";
	userMenu.appendChild(controls);
	preact.render(h(MenuActions, null), controls);
	chatHTML5.myUser = spyOn(chatHTML5.myUser, {
		selectedUserid: async selectedUserid => {
			const nuser = getUserById(selectedUserid);
			if (!nuser) return;
			userMenu.dataset.status = await GM.getValue(`${nuser.username}_status`);
			userMenu.dataset.username = nuser.username;
			userMenu.dataset.isCooldown = Boolean(await isOnCooldown(nuser.username)).toString();
			userMenu.dataset.privateCam = Boolean(!nuser.obj.webcamPublic).toString();
		},
	}).proxy;
}
async function setupSidebar() {
	const userList = document.getElementById("userList");
	if (!userList) return;
	$(userList).on("click", ".webcamBtn", function (event) {
		if (event.shiftKey || !event.originalEvent?.isTrusted) return;
		const webcamNumber = chatHTML5.getWebcamNumber();
		const webcamMax = +chatHTML5.roles.user.webcamMax;
		if (webcamNumber < webcamMax) return;
		const nextUser = $(this).closest(".userItem")[0];
		if (!nextUser?.dataset.id) return;
		const user = getUserById(nextUser.dataset.id);
		if (!user) return;
		if (user.obj.webcamPublic) {
			event.stopPropagation();
			setNextCam(nextUser);
			const panel = getPanelToClose(webcamNumber);
			if (panel?.id) jsPanel.activePanels.getPanel(panel.id)?.close();
		}
	});
	$(userList).on("click", ".fa-eye.fa-2x", function (e) {
		if (e.shiftKey) return;
		e.preventDefault();
		e.stopPropagation();
		e.stopImmediatePropagation();
	});
}
async function setupWatchStats() {
	const counter = document.getElementById("watchAtMe");
	if (!counter) return;
	GM.addStyle(ws_css);
	const stats = document.createElement("span");
	stats.id = "bbw_watch_stats";
	counter.after(stats);
	preact.render(h(WatchStats, null), stats);
	await trackWatchStats();
}
const ConfigWatchers = {};
function getPanelToClose(webcamNumber) {
	if (webcamNumber <= 0) return null;
	const optionA = $(`${PANEL_SELECTOR}:not(.watchingMe)[data-status="--"]`)[0];
	if (optionA) return optionA;
	for (let i = webcamNumber; i > 0; i--) {
		const optionB = $(`${PANEL_SELECTOR}[data-grid-index="${i}"]`)[0];
		if (optionB) return optionB;
	}
	const panels = queryPanels();
	return panels[panels.length - 1] || null;
}
async function setupTools() {
	chatHTML5.config.timeBeforeWatchingCamAgain = "1000";
	chatHTML5.config.checkOwnStream = "1";
	chatHTML5.config.showCountryFlag = "1";
	chatHTML5.roles.user.webcamMax = GM_getValue("user.webcamMax", 10);
	applySiteOptions();
	const { revoke } = spyOnConfig(ConfigWatchers);
	chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();
	await Promise.all([setupHeader(), setupUserMenu(), setupSidebar(), setupWatchStats()]);
	skipRedundantUserListRefresh();
	setupWatchingMe();
	if (!$("#sortWebcamtBtn").hasClass("selected")) $("#sortWebcamtBtn").trigger("click");
	return revoke;
}

// file://./src/betterbw/features/observeChat.tsx

function handleWebcamOpened(message) {
	const span = $("[data-id]", message)[0];
	if (!span) return;
	const user = getUserById(span.dataset.id);
	if (!user) return;
	message.dataset.username = user.username;
	const privateCam = Boolean(!user.obj.webcamPublic);
	message.dataset.privateCam = privateCam.toString();
	span.innerHTML = span.innerHTML.replace(
		/(User )(.*?)( has opened his webcam)/gi,
		`$1<span class="userLabelBBW" data-username=${JSON.stringify(user.username)}>$2</span>$3`,
	);
	if (!privateCam) clickOnCurrentAlgoButton();
}
function handleRegularMessage(message) {
	const msgHeader = $("[data-ip]", message)[0];
	if (!msgHeader) return;
	msgHeader.classList.add("userLabelBBW", "sender");
}
function handleWhisperOrPrivateMessage(message) {
	const msgHeader = $("[data-ip]", message)[0];
	if (!msgHeader || !msgHeader.childNodes.length) return;
	{
		const firstChild = msgHeader.childNodes[0];
		const span = document.createElement("span");
		span.dataset.username = msgHeader.dataset.username;
		span.classList.add("userLabelBBW", "sender");
		msgHeader.insertBefore(span, firstChild);
		span.appendChild(firstChild);
	}
	{
		const thirdChild = msgHeader.childNodes[2];
		const span = document.createElement("span");
		span.dataset.username = thirdChild.textContent?.trim();
		span.classList.add("userLabelBBW", "receiver");
		msgHeader.insertBefore(span, thirdChild);
		span.appendChild(thirdChild);
	}
}
function handlePrivateRequested(message) {
	const textNode = Array.from(message.childNodes).find(n => 3 === n.nodeType && n.textContent?.trim());
	if (!textNode || !textNode.textContent) return;
	const textContent = textNode.textContent;
	const match = textContent.match(/\s*(\S+?)\s+has invited you to watch his cam/);
	if (!match) return;
	const full_username = match[1];
	if (!full_username) return;
	const span = document.createElement("span");
	span.className = "userLabelBBW";
	span.dataset.username = full_username;
	span.textContent = full_username;
	message.insertBefore(span, textNode);
	textNode.textContent = textContent.replace(/(^\s*\S+?)(\s+.*$)/, "$2");
}
function handleWebcamRequest(message) {
	const textNode = Array.from(message.childNodes).find(n => 3 === n.nodeType && n.textContent?.trim());
	if (!textNode || !textNode.textContent) return;
	const textContent = textNode.textContent;
	const match = textContent.match(/You requested webcam of\s*(\S+)/);
	if (!match) return;
	const full_username = match[1];
	if (!full_username) return;
	const user = chatHTML5.getUserByUsername(full_username);
	if (!user) return;
	textNode.textContent = textContent.replace(/(^.*? of )(\s+.*$)/, "$1");
	const span = document.createElement("span");
	span.className = "userLabelBBW";
	span.dataset.username = full_username;
	span.textContent = full_username;
	message.appendChild(span);
	if (user.webcamPublic) {
		sessionCooldown.add(full_username);
		setTimeout(() => sessionCooldown["delete"](full_username), 1800000);
		message.append(" (unexpected)");
	}
}
function handleChatMessage(message) {
	if (message.matches(".serverMessage.webcamOpened")) handleWebcamOpened(message);
	else if (message.matches(".message.msg-box:not(.whisper)")) handleRegularMessage(message);
	else if (message.matches(".message.addPrivateMessage,.message.msg-box.whisper")) handleWhisperOrPrivateMessage(message);
	else if (message.matches(".serverMessage.privateRequested")) handlePrivateRequested(message);
	else if (message.matches(".serverMessage.webcamRequest")) handleWebcamRequest(message);
}
function observeChat(room) {
	return observeIt({ target: room, selector: ".message,.serverMessage", forEachAddedNode: handleChatMessage });
}
function observeChatNav() {
	const tabContent = $("#tabs .tab-content")[0];
	if (!tabContent) return;
	const tabs = {};
	return observeIt({
		target: tabContent,
		selector: ".tab-pane",
		forEachAddedNode: room => {
			tabs[room.id] = observeChat(room);
		},
		forEachRemovedNode: room => {
			if (room.id in tabs) {
				tabs[room.id]?.teardown?.();
				delete tabs[room.id];
			}
		},
	});
}

// file://./src/betterbw/features/responsiveLayout.ts

const CHAT_WIDTH_KEY = "config.chatWidth";
function setupResponsiveLayout() {
	const reorganize = debounce(() => organizePanels(), 100);
	window.addEventListener("resize", reorganize);
	const chat = document.getElementById("tabsAndFooter");
	if (!chat) return;
	const savedWidth = GM_getValue(CHAT_WIDTH_KEY, "");
	if (savedWidth) chat.style.width = savedWidth;
	const saveWidth = debounce(() => {
		if (chat.style.width) GM.setValue(CHAT_WIDTH_KEY, chat.style.width);
	}, 300);
	new ResizeObserver(() => {
		saveWidth();
		reorganize();
	}).observe(chat);
}

// file://./src/betterbw/features/lighterTimers.ts
const TIMESTAMPS = "#chatContainer .timeStamp, div.windowChat .timeStamp";
function displayDateAgo() {
	const selector = "1" === chatHTML5.config.displayConnectedSince ? `${TIMESTAMPS}, #userList .userSince` : TIMESTAMPS;
	for (const element of document.querySelectorAll(selector)) {
		const date = element.dataset.date;
		const text = chatHTML5.getDateAgo(date && /^\d+$/.test(date) ? Number(date) : date);
		if (element.textContent !== text) element.textContent = text;
	}
}
function lightenTimers() {
	const { removeServerMessages } = chatHTML5;
	chatHTML5.removeServerMessages = () => {
		if (!document.hidden) removeServerMessages();
	};
	chatHTML5.displayDateAgo = () => {
		if (!document.hidden) displayDateAgo();
	};
	document.addEventListener("visibilitychange", () => {
		if (!document.hidden) chatHTML5.displayDateAgo();
	});
}

// file://./src/betterbw/features/noCamsBeforeRoom.ts

function closeCam(panel) {
	const id = getUserId(panel);
	if (id) chatHTML5.removeWebcam(id, "bbw-before-room");
	else panel.remove();
}
function closeCamsUntil(roomSelected) {
	queryPanels().forEach(closeCam);
	const observer = new MutationObserver(mutations => {
		for (const { addedNodes } of mutations) for (const node of addedNodes) if (node instanceof HTMLDivElement && node.matches(PANEL_SELECTOR)) closeCam(node);
	});
	observer.observe(document.body, { childList: true, subtree: true });
	roomSelected.then(() => observer.disconnect());
}

// file://./src/betterbw/styles/dragToSwap.css?raw
const dts_css = `
.bbw-swap-highlight {
	position: fixed;
	z-index: 100000;
	box-sizing: border-box;
	border: 2px solid rgba(40, 140, 255, 0.9);
	border-radius: 4px;
	background: rgba(40, 140, 255, 0.35);
	pointer-events: none;
}
`;

// file://./src/betterbw/features/dragToSwap.ts

let dts_drag = null;
const distance = (a, b) => Math.hypot(a.left - b.left, a.top - b.top);
function highlight(rect) {
	const el = document.createElement("div");
	el.className = "bbw-swap-highlight";
	Object.assign(el.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
	document.body.appendChild(el);
	return el;
}
function stopHover(d) {
	d.timers.forEach(clearTimeout);
	d.timers = [];
	d.highlights.forEach(el => el.remove());
	d.highlights = [];
	d.hovered = null;
}
function startHover(d, target) {
	const slot = d.slots.get(target);
	d.hovered = target;
	d.timers = [
		setTimeout(() => {
			d.highlights = [highlight(slot), highlight(d.origin)];
		}, 250),
		setTimeout(() => {
			stopHover(d);
			d.pending = { target, index: target.dataset.gridIndex, slot };
			placeInSlot(target, +d.index);
		}, 1000),
	];
}
function dts_update() {
	const d = dts_drag;
	if (!d) return;
	d.frame = 0;
	const rect = d.panel.getBoundingClientRect();
	if (!d.moved) {
		if (distance(rect, d.origin) < 3) return;
		d.moved = true;
		d.panel.classList.add("bbw-dragging");
	}
	if (d.pending) {
		if (distance(rect, d.pending.slot) <= 24) return;
		placeInSlot(d.pending.target, +d.pending.index);
		d.pending = null;
	}
	let hovered = null;
	for (const [other, slot] of d.slots)
		if (other.isConnected && distance(rect, slot) <= 20) {
			hovered = other;
			break;
		}
	if (hovered === d.hovered) return;
	stopHover(d);
	if (hovered) startHover(d, hovered);
}
function dts_onPointerDown(event) {
	if (0 !== event.button || !(event.target instanceof Element)) return;
	if (!event.target.closest(".jsPanel-hdr") || event.target.closest("button, input, a, .jsPanel-btn, .userAvatar")) return;
	const panel = event.target.closest(PANEL_SELECTOR);
	const index = panel?.dataset.gridIndex;
	if (!panel || !index) return;
	const slots = new Map();
	for (const other of queryPanels()) if (other !== panel && other.dataset.gridIndex) slots.set(other, other.getBoundingClientRect());
	dts_drag = {
		panel,
		index,
		origin: panel.getBoundingClientRect(),
		slots,
		moved: false,
		hovered: null,
		timers: [],
		highlights: [],
		pending: null,
		frame: 0,
	};
}
function onPointerMove() {
	if (dts_drag && !dts_drag.frame) dts_drag.frame = requestAnimationFrame(dts_update);
}
function onPointerUp() {
	const d = dts_drag;
	if (!d) return;
	dts_drag = null;
	cancelAnimationFrame(d.frame);
	stopHover(d);
	if (!d.moved) return;
	setTimeout(() => {
		d.panel.classList.remove("bbw-dragging");
		const { pending } = d;
		if (!pending) return;
		if (distance(d.panel.getBoundingClientRect(), pending.slot) <= 24) {
			d.panel.dataset.gridIndex = pending.index;
			pending.target.dataset.gridIndex = d.index;
			organizePanels();
		} else placeInSlot(pending.target, +pending.index);
	});
}
function setupDragToSwap() {
	GM.addStyle(dts_css);
	document.addEventListener("pointerdown", dts_onPointerDown, true);
	document.addEventListener("pointermove", onPointerMove, { capture: true, passive: true });
	document.addEventListener("pointerup", onPointerUp, true);
	document.addEventListener("pointercancel", onPointerUp, true);
}

// file://./src/betterbw/styles/static.css?raw
const static_css = `
body>div:nth-child(1) {
	height: calc(100% - 4px);
}
body:not([data-algo]) button[data-sort-order=''],
body[data-algo=''] button[data-sort-order=''],
body[data-algo='new'] button[data-sort-order='new'],
body[data-algo='top'] button[data-sort-order='top'] {
	color: white;
	background-color: #50c180;
}
input.numberOfCams {
	width: 4em;
}
.panel-action-btn {
	cursor: pointer;
	margin-left: 8px;
	background: rgba(255, 255, 255, 0.8);
	color: inherit;
	font-size: 14px;
	float: right;
	position: relative;
	border: 1px solid #ddd;
	top: 2px;
	height: 15px;
	line-height: 0;
	opacity: 1;
	transition: opacity 0.2s ease-out;
}
.panel-action-btn:where([data-status-value='--'], [data-status-value='-'], [data-status-value='+'], [data-status-value='++']) {
	margin-left: 0;
}
.panel-action,
.panel-cooldown {
	position: absolute;
	z-index: 1;
	display: flex;
	border-radius: 4px;
	overflow: hidden;
	background: rgba(0, 0, 0, 0.5);
	opacity: 0;
	transition: opacity 0.2s ease-out;
	.panel-action-btn {
		all: unset;
		box-sizing: border-box;
		cursor: pointer;
		color: #fff;
		font-size: 12px;
		line-height: 20px;
		padding: 0 6px;
		text-align: center;
		opacity: 0.85;
		transition: opacity 0.2s ease-out;
		&:hover {
			opacity: 1;
		}
	}
}
.panel-action {
	left: 4px;
	top: 24px;
}
.panel-cooldown {
	right: 2px;
	top: 24px;
}
.jsPanel-hdr {
	container-type: inline-size;
}
@container (max-width: 240px) {
	:is(.panel-action, .panel-cooldown) .panel-action-btn {
		padding: 0 3px;
		font-size: 11px;
	}
}
.jsPanel[data-grid-index][data-actions-attached]:not(.ui-draggable-dragging, .bbw-dragging) {
	transition:
		top 0.15s linear,
		right 0.15s linear,
		bottom 0.15s linear,
		left 0.15s linear,
		translate 0.15s linear;
}
.jsPanel:hover :is(.panel-action, .panel-cooldown) {
	opacity: 1;
}
.jsPanel .speaks {
	width: 3px;
	rotate: 180deg;
	top: 0;
	bottom: 0;
	left: 0;
	.volume {
		background: yellow;
		box-shadow:
			1px 1px 1px rgb(0, 0, 0),
			2px 2px 1px rgb(255, 255, 255);
	}
}
.jsPanel .jsPanel-content {
	background: #111;
}
:where(#userMenu, .jsPanel)[data-status='--'] [data-status-value='--'] {
	background: rgba(205, 0, 0, 1);
	color: #fff;
}
:where(#userMenu, .jsPanel)[data-status='-'] [data-status-value='-'] {
	background: rgba(237, 146, 0, 1);
	color: #fff;
}
:where(#userMenu, .jsPanel)[data-status='+'] [data-status-value='+'] {
	background: rgba(0, 167, 228, 1);
	color: #fff;
}
:where(#userMenu, .jsPanel)[data-status='++'] [data-status-value='++'] {
	background: rgba(149, 50, 255, 1);
	color: #fff;
}
:where(#userMenu, .jsPanel)[data-is-cooldown='true'] [data-status-value='⏱'] {
	background: rgba(50, 50, 50, 1);
	color: #fff;
}
#userMenu .menuUserItem[data-action="whisper"] {
	display: block !important;
}
#userMenu[data-private-cam='true'] [data-action='viewWebcam'] {
	color: red;
	.fa.fa-video-camera:after {
		color: red;
		content: ' \\f023';
		font-family: 'Font Awesome 5 Free';
		font-weight: 900;
	}
}
#tabs .tab-pane.tab-pane {
	padding: 10px 10px 10px 20px !important;
}
#tabs .addPrivateMessage {
	.mention,
	.userLabelBBW.receiver {
		pointer-events: none;
	}
	.name-time {
		flex-wrap: wrap;
		.content {
			flex-basis: 100%;
		}
	}
}
#tabs .serverMessage,
#tabs .addPrivateMessage,
#tabs .message {
	&.whisper:after {
		right: unset;
		left: -10px;
		top: -1px;
		font-size: 9px;
		line-height: 1;
		width: initial;
		padding: 1px;
		height: min-content;
	}
}
#tabs .serverMessage[data-private-cam='true']:after,
#userMenu[data-private-cam='true'] [data-action='viewWebcam'].fa:after {
	content: ' \\f023';
	font-family: 'Font Awesome 5 Free';
	color: red;
	font-weight: 900;
}
#tabs .serverMessage[data-private-cam='true']:after {
	margin-left: 20px;
}
#tabs .webcamOpened .watchCam {
	position: relative;
}
.jsPanel .userAvatar {
	--avatarSize: 22px;
	cursor: pointer;
	padding: 0;
	border-radius: var(--avatarSize);
	height: var(--avatarSize);
	width: var(--avatarSize);
	margin-top: -1px;
	object-fit: cover;
}
.jsPanel-btn-close {
	line-height: 1;
}
.headerPrivateBtn {
	display: none;
}
.jsPanel[data-status='undefined'] .jsPanel-title {
	text-decoration-color: orange;
	text-decoration-line: underline;
	text-decoration-style: solid;
	text-decoration-thickness: 2px;
}
.jsPanel[data-status='undefined'] button:where([data-status-value='++']),
.jsPanel[data-status='--'] button:where([data-status-value='++']),
.jsPanel[data-status='-'] button:where([data-status-value='++']),
.jsPanel[data-status='+'] button:where([data-status-value='--']),
.jsPanel[data-status='++'] button:where([data-status-value='--']) {
	display: none;
}
.jsPanel:where([data-rotation=''], [data-rotation='0']) video {
	rotate: 0deg;
}
.jsPanel[data-rotation='90'] video {
	rotate: 90deg;
}
.jsPanel[data-rotation='180'] video {
	rotate: 180deg;
}
.jsPanel[data-rotation='270'] video {
	rotate: 270deg;
}
.jsPanel[data-rotation='90'] video,
.jsPanel[data-rotation='270'] video {
	width: 85% !important;
	margin-left: 7.5%;
}
.slide_block {
	width: 14px;
}
#usersContainer {
	width: 240px;
	&.leftLayout #slide_block {
		top: 50px;
		left: 31px;
		z-index: 101;
		height: 50px;
	}
	> ul.nav.nav-pills > li > a {
		padding: 0.2rem;
		height: auto !important;
	}
}
#myWebcamContainer {
	> .btn-group {
		padding-block: 0;
	}
	.btn {
		text-wrap: inherit;
		line-height: 1 !important;
	}
	#myAudioVideoCheckBoxContainer {
		position: absolute;
		top: 0;
		right: 0;
		text-wrap: nowrap;
	}
	#myAudioVideoCheckBoxContainer .btn {
		min-height: 1rem;
	}
	#myWebcamDiv>button {
		transform: translateY(-15px) scaleY(.25);
		transition: transform .2s ease-out;
	}
	#myWebcamDiv>div {
		transform: translateY(-7px) scaleY(.25);
		transition: transform .2s ease-out;
	}
	&:hover #myWebcamDiv>button,
	&:hover #myWebcamDiv>div {
		transform: initial;
	}
}
#userList .userItem {
	border-bottom: none;
	margin-left: 1px;
}
#userList .userLabel {
	top: 0;
	margin-left: 2px;
	padding-left: 8px;
	border-top-left-radius: 9px;
	border-bottom-left-radius: 9px;
	.userSince {
		left: unset;
	}
}
.webcamBtn {
	padding-inline: 1rem;
	margin: 0;
	border-top-left-radius: 0;
	border-bottom-left-radius: 0;
}
.webcamBtn i.lock {
	&.fa-unlock {
		display: none;
	}
	&.fa-lock {
		text-shadow: -2px 2px 0 white;
		right: -25px;
		top: 1px;
	}
	position: absolute;
	left: -11px;
	top: 5px;
	font-size: 16px;
}
.webcamBtn i.fa-volume-down {
	padding-inline: 4px;
}
.eye-icon .fa-eye.isWatching {
	color: gold !important;
	position: absolute;
	right: 42px;
	bottom: 5px;
	text-shadow: -1px -1px 1px goldenrod;
}
#userList .userItem:has(.webcamBtn.visible i.lock.fa-lock) {
	--lock-color: rgba(205, 0, 0, 0.33);
	--v-padding: 0px;
	.userLabel {
		box-shadow: inset 3px 0 1px 2px var(--lock-color);
	}
	.webcamBtn.visible {
		box-shadow: inset -3px 0 1px 2px var(--lock-color);
		border: none;
	}
}
.jsPanel {
	box-shadow: none;
	border-color: #888 !important;
}
#roomsBtn {
	line-height: 1 !important;
	padding-left: 6px !important;
	padding-right: 3px !important;
	margin-right: 0px !important;
}
.header-btn-wrap {
	margin: 0 3px;
	padding-right: 0px;
}
.header-custom-btns span {
	padding-right: 10px;
}
#myAvatar {
	padding-inline: 0;
	.myUsername {
	display: none;
}}
#bbw_header_controls {
	position: relative;
	display: flex;
	align-items: center;
	margin-left: 6px;
	white-space: nowrap;
	button,
	input {
		margin: 0;
		padding-inline: 0.5rem;
		line-height: 1.275;
	}
	input[type=number] {
		padding-inline: 0;
	}
	label {
		margin: 0;
	}
}
#header {
	padding-right: 0 !important;
	padding-left: 0 !important;
	height: 30px !important;
	.status {
		top: -8px;
		left: -6px;
	}
}
#tabsAndFooter,
#footer {
	width: max(280px, min(50%, calc(100% - var(--bbw-cams-width, 1107px))));
}
#tabsAndFooter {
	resize: horizontal;
	overflow: hidden;
	min-width: 200px;
	max-width: 80%;
}
#footer {
	position: relative;
	width: 100%;
}
video.mobile.mobile {
	max-width: 100% !important;
	max-height: 100% !important;
}
.jsPanel-headerbar {
	min-height: 18px;
}
.jsPanel-titlebar {
	min-height: 16px;
}
.jsPanel-titlebar h3 {
	margin-block: 1px;
}
`;

// file://./src/betterbw/styles/topLevel.css?raw
const tl_css = `
iframe {
	display: block;
}
`;

// file://./src/betterbw/betterbw.user.ts

async function topLevelStyles() {
	GM.addStyle(tl_css);
}
function hacks() {
	chatHTML5.myUser.mutedUsers = chatHTML5.myUser.mutedUsers || "";
	const original_updateNumberUsersDisplay = chatHTML5.updateNumberUsersDisplay;
	chatHTML5.updateNumberUsersDisplay = debounce(original_updateNumberUsersDisplay);
	batchUserListRebuilds();
	setupCamCleanup();
	lightenTimers();
	applySiteOptions();
}
async function main() {
	hacks();
	GM.addStyle(static_css);
	sweepExpiredCooldowns();
	setupResponsiveLayout();
	observeChatNav();
	const roomSelected = waitToBe("#roomsModal", ["aria-hidden"], el => "false" === el.getAttribute("aria-hidden")).then(() => waitToBe("#roomsModal"));
	closeCamsUntil(roomSelected);
	observePanels();
	setupCamsMoveAway();
	setupDragToSwap();
	await roomSelected;
	setRoomSelected();
	await setupTools();
	await runAlgo(getSetting("preferredAlgo"));
}

// file://./src/betterbw/index.ts

if (location.pathname.startsWith("/html5-chat/chatroom")) topLevelStyles();
else if (location.pathname.startsWith("//html5-chat/chat2") && "undefined" != typeof chatHTML5) main();
