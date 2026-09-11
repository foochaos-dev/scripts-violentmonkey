# Better BW

A userscript to improve Bateworld's VidChat experience. It adds features like:

- **Automations** that keep your screen full of cams, picking the buddies you like (or the ones you haven't seen yet)
- **Ratings** (`--`, `-`, `+`, `++`) that follow each buddy around: on their cam, on the sidebar and in the chat
- **A tidy grid** of cams that adapts to your screen
- **Cam gestures**: scroll for volume, pinch to zoom, drag to look around
- **"Watching me" stats**: your record audience, and more

See what changed in each version in the [changelog](CHANGELOG.md).

---
### How to use

- Right after you select a room it will open 10 cams for you
- Choose one of the automations on the top of the page (on the left of the ad)
- You can also set how many cams you want to watch, and the size of the panels
    - The cams shrink automatically when they don't fit your screen, so the size is a maximum

### Automations

When enabled, every time a cam closes (or someone opens a public cam) it will try to open as many cams as possible according to the algorithm you selected:

- `ø` : **Disable automation** (default)
    - Also useful to align all open cams into a grid (💪 for my fellow OCD's)
- `New` : **The New Flesh**
    - Prioritizes cams of buddies that you haven't liked/disliked before
    - `<new users>`, `+`, `++`, `-`
- `Top` : **The Eye Candy**
    -  Prioritizes cams of buddies you liked
    - `++`, `+`, `<new users>`, `-`

Buddies marked with `--`, or hidden with `X`/`⏱`, are never picked.
The automation takes a break while the tab is in the background (let's save BW's resources), and catches up when you come back.

### Cam controls

Hover your buddy's cam to see the buttons. Hover the buttons to see what they do.

- `X` (close button) : Hides this person for 1 min
- `⏱` : Hides this person for 15 min
- `⟳` : Rotates other user's cam (it's remembered for the next time)
- `+` : You liked this buddy
    - `++` : You liked this buddy A LOT (this option appears after you liked `+` that buddy)
- `-` : You _sorta_ liked this buddy (it depends on the day, on your mood, on the weather...)
- `--` : Do not suggest this person
- Click the buddy's picture to open their menu. It has the same rating and `⏱` buttons, and always shows the "whisper" option

Buddies you haven't rated yet get their name underlined in orange.
The open cams that are also watching you get a golden border and an 👁 icon.
If you're watching a private cam, its title gets a red 🔒.
A cam that doesn't load within 25 seconds is closed, and that buddy is hidden for 5 min.

### Cam gestures

- **Scroll** over a cam to change its volume
    - Fingers (or the mouse wheel) up: louder
    - Fine steps near 0%, a bit bigger near 100%
    - The volume is remembered for each buddy; muting lasts until you reload the page
- **Pinch** (or `Ctrl` + scroll) over a cam to zoom into it, instead of zooming the whole page
    - **Drag** to look around while zoomed
    - **Double-click** to zoom out
- **Clicking** a cam doesn't pause it anymore; use the play button on its controls bar

### Sidebar

- Automatically sorts all cams to the top
- Mark the cams you're already watching (so you don't close them by accident)
- Your ratings color the list: `++` purple, `+` blue, `-` orange, and `--` faded out
- Fade down "busy" users (when they're on a call with other buddy)
- Improve indication of private cams (puts a red border around the user)
- Shows the country flags
- When you're already at your max # of cams, clicking a camera icon swaps one of the open cams for it (a `--` one first, otherwise the last one)
- Clicks on the eye icon are ignored, so you don't click it by accident (hold shift to click it)

#### Watching me

Next to the "Watching me" counter:

- **max**: the most people that have ever watched you at once
- **session**: the most people watching you at once since you loaded the page (it appears while you're transmitting, and stays after you stop)

Hover it for more stats, now, this session and ever:

- How many of your watchers have their cam on, and how many of them you're watching back
- Which share of the room, and of the cams, is watching you
- Unique watchers, how long you've been watched, and your average audience
- Your record's date, and your regulars (the buddies that watched you in more sessions)

The stats are only counted while the main "Bateworld" chat tab is open.

### Chat

- Buddies' names get the colors of your ratings
- Buddies you're watching get a small "panel" icon next to their names
- "Has opened his webcam" messages show a red 🔒 for private cams
- Whispers and cam invitations get the same treatment
- If a public cam kicks you out (the chat says "You requested webcam of..."), that buddy is skipped by the automations for 30 min

### Shift+click

Some controls behave a bit differently if you hold shift when you click on them:

- `X` (close button) : Also reduces the # of cams, so the Automation doesn't open a new cam
- `⏱` : Hides the person for 2h
- The camera icon on the sidebar: Increases the # of cams if necessary, then open that cam
- The eye icon on the sidebar: Works as usual

### Tips:

- If the automation opens your own cam, mark that with `--` (Do not suggest this person)
- You can resize the chat with the small triangle near the "Send" button. Its width is remembered
- Hover your own cam to see its controls
- Everything (ratings, volumes, stats...) is saved in your browser, in the userscript's storage
