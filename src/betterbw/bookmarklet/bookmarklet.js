// Better bateworld.com — bookmarklet
//
// Alternative to a userscript manager. Deliberately tiny and frozen: it only fetches
// the latest `shimmonkey.js` from the git repo and hands it the sleazyfork URL.
// The build minifies this file into a ready-to-paste `javascript:` URL at
// `dist/static/js/bookmarklet.min.js`
fetch("https://raw.githubusercontent.com/foochaos-dev/scripts-violentmonkey/main/src/betterbw/bookmarklet/shimmonkey.js")
	.then(r => r.text())
	// Indirect eval: runs in the global scope, where the file evaluates to Shimmonkey's function.
	.then(src => (0, eval)(src)("https://sleazyfork.org/scripts/556219-better-bateworld-com/code.user.js"))
	.catch(err => alert(`Better bateworld.com bookmarklet failed: ${err.message}`));
