# Better BW

A userscript to improve Bateworld's VidChat experience. It adds features like:

- **Automations** that keep your screen full of cams, picking the buddies you like (or the ones you haven't seen yet)
- **Ratings** (`--`, `-`, `+`, `++`) that follow each buddy around: on their cam, on the sidebar and in the chat
- **A tidy grid** of cams that adapts to your screen, and that you can rearrange by dragging
- **Cam gestures**: scroll for volume, pinch to zoom, drag to look around
- **"Watching me" stats**: your record audience, and more

See how to [install it](INSTALL.md), and what changed in each version in the [changelog](CHANGELOG.md).

---
### How to use

- Right after you select a room it will open 10 cams for you
- The controls live on the top bar, next to your picture:
    - `⚙` : [Settings](#settings) (hover to peek, click to keep it open)
    - `▦` : Rearranges the open cams into the grid (💪 for my fellow OCD's)
    - `#` : How many cams you want to watch
    - `⏸`/`▶` : Stops/starts opening cams automatically
- Choose which cams to prioritize, the layout and the size of the cams in the settings

### Automations

While it's running (`⏸` on the top bar), every time a cam closes (or someone opens a public cam) it will try to open as many cams as possible, prioritizing the cams you picked in the settings (**Which cams to prioritize**):

- `Top` : **The Eye Candy** (default)
    -  Prioritizes cams of buddies you liked
    - `++`, `+`, `<new users>`, `-`
- `New` : **The New Flesh**
    - Prioritizes cams of buddies that you haven't liked/disliked before
    - `<new users>`, `+`, `++`, `-`

Click `⏸` to stop it: the open cams are kept, and aligned into the grid. `▶` starts it again.

With **Upgrade `-`** (on by default), even when your screen is full it swaps an open `-` cam for a better one when there's one online (someone you haven't rated with `New`, a `+` or `++` with `Top`), one at a time:

- The `-` cams that aren't watching you back go first
- A `-` cam you opened yourself (clicking its camera icon on the sidebar) stays for at least 5 min; the ones the automation opened can be swapped anytime

Buddies marked with `--`, or hidden with `X`/`⏱`, are never picked.
The automation takes a break while the tab is in the background (let's save BW's resources), and catches up when you come back.

### Cam controls

Hover your buddy's cam to see the buttons. Hover the buttons to see what they do.

- On the top left, the ratings:
    - `--` : Do not suggest this person (also closes the cam)
    - `-` : You _sorta_ liked this buddy (it depends on the day, on your mood, on the weather...)
    - `+` : You liked this buddy
    - `++` : You liked this buddy A LOT (this option appears after you liked `+` that buddy)
- On the top right:
    - `⏱` : Hides this person for 15 min
    - `X` (close button) : Hides this person for 1 min
- `⟳` (next to the zoom buttons) : Rotates the buddy's cam (it's remembered for the next time)
- Click the buddy's picture to open their menu. It has the same rating and `⏱` buttons, and always shows the "whisper" option
- **Middle click** (or `Ctrl` + click) the cam's title to close it and reduce the # of cams
- **Drag** a cam by its title over another cam and hold it there for a second: the other cam moves to the empty spot, and you can drop yours in its place

Buddies you haven't rated yet get their name underlined in orange.
The open cams that are also watching you get a golden border and an 👁 icon.
If you're watching a private cam, its title gets a red 🔒.
A cam that doesn't load within 25 seconds is closed, and that buddy is hidden for 5 min.

### Cam gestures

- **Hover** a cam to see its controls: play/pause, mute, volume, full screen and zoom. They hide again after 2 seconds without moving the mouse
- **Scroll** over the controls to change the volume (can be turned off in the settings)
    - Fingers (or the mouse wheel) up: louder
    - Fine steps near 0%, a bit bigger near 100%
    - The volume is remembered for each buddy (new ones start at the default volume from the settings); muting lasts until you reload the page
- **Pinch** (or `Ctrl` + scroll) over a cam, or use the `+`/`−` buttons above its full screen button, to zoom into it instead of zooming the whole page (can be turned off in the settings)
    - **Drag** or **scroll** to look around while zoomed, like on a zoomed-in webpage
    - `1×` zooms back out
- **Double-click** a cam to go full screen
- **Clicking** a cam doesn't pause it; use the play button on its controls

### Sidebar

- Automatically sorts all cams to the top
- Mark the cams you're already watching (so you don't close them by accident)
- Your ratings color the list: `++` purple, `+` blue, `-` orange, and `--` faded out
- Fade down "busy" users (when they're on a call with other buddy)
- Improve indication of private cams (puts a red border around the user)
- Shows the country flags
- When you're already at your max # of cams, clicking a camera icon swaps one of the open cams for it (a `--` one that isn't watching you first, otherwise the last one)
- Clicks on the eye icon are ignored, so you don't click it by accident (hold shift to click it)

#### Watching me

Next to the "Watching me" counter:

- **max**: the most people that have ever watched you at once
- **session**: the most people watching you at once since you loaded the page (it appears while you're transmitting, and stays after you stop)

Hover it for more stats, now, this session and ever:

- How many of your watchers have their cam on, and how many of them you're watching back
- Which share of the room, and of the cams, is watching you
- Unique watchers, how long you've been watched, and your average audience
- Your record's date, and your regulars (who watched you the longest, and in how many sessions)

The stats are only counted while the main "Bateworld" chat tab is open.
You can also get a notice in the chat when someone starts watching you (see [Settings](#settings)).

### Chat

- Buddies' names get the colors of your ratings
- Buddies you're watching get a small "panel" icon next to their names
- "Has opened his webcam" messages show a red 🔒 for private cams
- Whispers and cam invitations get the same treatment
- If a public cam kicks you out (the chat says "You requested webcam of..."), that buddy is skipped by the automations for 30 min

### Settings

Hover `⚙` on the top bar to see them (click it to keep them open; `Esc` or a click outside closes them). Everything saves and applies right away:

- **Tell me when someone starts watching me**: off, only `++` buddies, only buddies you liked (`+`, `++`), or everyone (except `--`). The notice shows up in the chat
- **Sidebar**: for how long buddies are online
- **Chat**: group messages in a row from the same buddy, enter/leave/kick notices (and after how long they disappear)
- **Cams**:
    - Which cams to prioritize, and whether to upgrade `-` cams (see [Automations](#automations))
    - Default volume for new cams, and whether they start muted
    - Scroll wheel changes the volume, and pinch (or `Ctrl` + scroll) zooms into the cam (see [Cam gestures](#cam-gestures))
- **Layout** (switching it waits for the "Apply layout" button, since it rearranges every cam):
    - **Adaptable grid** (default): pick how many rows fill the window's height, and the max size of the cams (they shrink when they don't fit)
    - **Classic grid**: 3 rows of cams of an exact size, whatever the size of the window
- **Cams move away**: rest the pointer on a free bit of the chat's tabs, or of the buddy list, and the cams in front of it slide out of the way until the pointer leaves. Cams under the pointer stay where they are, so you never lose their controls as you aim at them

The "Sidebar", "Chat" and "start muted" options are the chat's own, that it doesn't let you change. They apply to new messages, buddies and cams.

### Shift+click

Some controls behave a bit differently if you hold shift when you click on them:

- `X` (close button) : Also reduces the # of cams, so the automation doesn't open a new cam (same as middle click on the cam's title)
- `⏱` : Hides the person for 2h
- The camera icon on the sidebar: Increases the # of cams if necessary, then open that cam
- The eye icon on the sidebar: Works as usual

### Tips:

- If the automation opens your own cam, mark that with `--` (Do not suggest this person)
- You can resize the chat with the small triangle near the "Send" button. Its width is remembered
- Hover your own cam to see its controls
- Everything (ratings, volumes, stats...) is saved in your browser, in the userscript's storage
