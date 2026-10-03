# Installing Better BW

Back to the [feature list](README.md).

## With a userscript manager (recommended)

1. Install a userscript manager:
    - **Chrome**: [Tampermonkey](https://chromewebstore.google.com/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
        - After installing it, open the extension's details (`chrome://extensions` → Tampermonkey → Details) and turn on **Allow User Scripts**
    - **Firefox**: [Greasemonkey](https://addons.mozilla.org/firefox/addon/greasemonkey/), [Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/) or [Violentmonkey](https://addons.mozilla.org/firefox/addon/violentmonkey/)
    - **Safari**: [Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089) or [Userscripts](https://apps.apple.com/app/userscripts/id1463298887)
    - **Microsoft Edge**: [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) or [Violentmonkey](https://microsoftedge.microsoft.com/addons/detail/violentmonkey/eeagobfjdenkkddmbclomhiblgggliao)
    - Other browsers: see [Greasy Fork's guide](https://greasyfork.org/help/installing-user-scripts)
2. *(optional)* If you use BW in incognito/private mode, turn on **Allow in Incognito** (or **Run in Private Windows**) in the extension's settings
3. Install the script from [Sleazy Fork](https://sleazyfork.org/scripts/556219-better-bateworld-com)
4. Back on the VidChat tab, click the userscript manager's icon and make sure **Better bateworld.com** is toggled on
5. Refresh the page and enjoy a better bate world!

The userscript manager keeps the script up to date for you.

## As a bookmarklet (for a quick try only)

If you just want to try it out without installing anything, there's also a bookmarklet. Create a bookmark and paste this as its URL (the copy button is on the right of the box):

```
javascript:fetch("https://raw.githubusercontent.com/foochaos-dev/scripts-violentmonkey/main/src/betterbw/bookmarklet/shimmonkey.js").then(t=>t.text()).then(t=>(0,eval)(t)("https://raw.githubusercontent.com/foochaos-dev/scripts-violentmonkey/main/dist/static/js/betterbw.user.js")).catch(t=>alert(`Better bateworld.com bookmarklet failed: ${t.message}`));
```

Then open the VidChat and click the bookmark.

**This isn't the recommended way.** Every click downloads the latest code straight from this repository and runs it inside BW's page, with no review step and no isolation from the site. Use it to take a quick look, then switch to a [userscript manager](#with-a-userscript-manager-recommended).
