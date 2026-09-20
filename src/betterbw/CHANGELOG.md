# Changelog

All notable changes to Better BW are documented here.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.9.1] - 2026-09-20

### Changed

- "Cams move away": resting the pointer on the chat's tabs now moves only the cams that cover the tab strip, instead of shifting their whole column down. Those cams slide in front of the row below them, so their controls stay clickable
- The script is 4% smaller (98.6 kB → 94.9 kB)

### Fixed

- A click on the controls of a cam that had moved away didn't register: every press dropped the cams back on their spots first, so the click landed on whatever ended up under the pointer. Only grabbing a cam by its title bar (the start of a drag) puts them back now

### Internal

- The bundle uses the members of the `preact`/`preactHooks` globals directly (`h(...)`, `useState(...)`), declared where the bundler declared the global
- The bundle is formatted at 160 columns, and the module markers lost their leading `;`
- `console.*` calls are stripped from the build (`drop_console`)
- The rating buttons hidden by the buddy's status share a single rule in `static.css`


## [1.9.0] - 2026-09-16

### Changed

- The script is 25% smaller (131 kB → 98 kB), and no longer downloads Preact's `jsx-runtime`

### Internal

- Styles are bundled as plain strings (`?raw`) instead of through `css-loader`, without comments and blank lines
- JSX compiles to `preact.h(...)`, and the bundle calls the `preact`/`preactHooks` globals directly
- The bundle is indented with tabs
- Names renamed by the bundler to avoid clashes use a shorter module prefix (`watchStatsDisplay_int` → `wsd_int`)


## [1.8.0] - 2026-09-12

### Added

- A notice in the chat when someone starts watching you: off (default), only your `++` buddies, only buddies you liked (`+`, `++`), or everyone
- Regulars in the "Watching me" stats are ranked by how long they watched you
- A `⚙` settings menu on the top bar, with some of the chat's own options that it doesn't let you change (online time, ages, grouped messages, enter/leave notices, cams starting muted, opening the most popular cam), plus the default volume for new cams and toggles for scroll-to-volume and pinch-to-zoom
- Middle click (or `Ctrl` + click) a cam's title to close it and reduce the number of cams allowed open, same as `Shift` + click on its close button
- "Cams move away": rest the pointer on a free bit of the chat's tabs, or of the buddy list, and the cams in front of it slide out of the way until the pointer leaves. A cam under the pointer is never moved, so its controls stay where you aimed. It replaces the "Chat tab offset" option, which kept the cams over the chat permanently lower

### Changed

- Compact controls on the cams (play/pause, mute, volume, full screen, zoom), the same on Chrome and Firefox. They hide after 2 seconds without moving the mouse (the native ones could stay up forever), clicking the video no longer pauses it, and double-clicking it goes full screen
- Smoother scroll-to-volume, now only over the cam's controls (so scrolling over the video doesn't change it by accident).
- The "Watching me" stats and the golden borders use the chat's own list of watchers: they update instantly, and stay right when the sidebar is filtered
- Lighter on the browser: timestamps are only rewritten when they change, and the chat's timers take a break while the tab is hidden

### Fixed

- Closed cams could keep streaming in the background, and even be heard: only the chat's own close button really stopped a cam, so the ones closed by the script (`⏱`, `--`, middle click, swapping from the sidebar, the 25 seconds timeout) kept going. Now every closed cam stops its stream, and tells the chat you stopped watching
- A cam closed while it was still loading could be hidden for 5 min, 25 seconds later
- Clicking a room tab froze the page for a while: the site rebuilt the whole user list, even when that room was already open. Now the list is only rebuilt when needed, and much faster
- The "cams to the top" sorting could be turned off by the script itself, when the site had it on already
- Swapping a cam from the sidebar now avoids closing a `--` buddy who's watching you (it was meant to, but didn't)


## [1.7.0] - 2026-09-11

### Added

- Pinch over a cam (or use its `+`/`−` buttons, above the full screen one) to zoom into it, instead of zooming the whole page. Drag or scroll to look around while zoomed, like on a zoomed-in webpage; `1×` zooms back out
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
