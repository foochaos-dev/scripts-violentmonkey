# Changelog

All notable changes to Better BW are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.7.0] - 2026-09-11

### Added

- Pinch (or `Ctrl` + scroll) over a cam zooms into it, towards the cursor, instead of zooming the whole page. Drag to look around while zoomed; double-click to zoom out
- "Watching me" records next to the sidebar counter: the most people watching you at once, ever and this session. Hover for more stats: watchers on cam, watching you back, share of the room and of the cams, unique watchers, time watched, average audience and your regulars. Only counted while the main "Bateworld" chat tab is open
- The chat width is remembered
- Cams shrink to fit smaller screens (up to the panel size you set), and re-fit when the window or the chat is resized

### Changed

- Smoother scroll-to-volume: fine steps near 0%, a bit bigger near 100%, and eased mouse-wheel notches. Fingers (or the mouse wheel) up is louder, on trackpads and mice
- Clicking a cam no longer pauses it (its play button still does)
- The chat's default width follows the panel size, and never gets narrower than 280px
- Tighter buttons on small cams
- New permission: `GM.deleteValue`, to clean up expired cooldowns. Violentmonkey asks you to approve it when updating

### Fixed

- The chat disappeared on screens narrower than ~1350px
- Scroll-to-volume also scrolled the page, and used tiny steps all the way up to 50%
- A cam that loaded very fast could be closed as "not loading" after 25 seconds, hiding that buddy for 5 min
- The rating and `⏱` buttons on the user menu now reliably apply to the selected buddy
- A cam could get its buttons twice
- The ratings' colors could stop updating until the page was reloaded
- Expired cooldowns were kept in the storage forever
- A panel size set in the header could misplace the cams right after loading
- The script no longer stops loading when the chat tabs aren't found

### Internal

- Removed unused code and the `ts-node` dependency
- `rsbuild dev` now outputs the same `betterbw.user.js` file name as the build, and keeps the console logs
