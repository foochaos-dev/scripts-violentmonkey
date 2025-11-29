import { dataUsername } from './utils/formatters';
import { queryPanels } from './utils/openPanel';
import { getUsername } from './utils/scrappers';
import openPanelsCss from './styles/openPanels.css?raw';

const dynamicOpenedStyle = GM_addStyle('');

export function updateCssForOpenedPanels() {
  const opened = queryPanels();
  if (!opened?.length) return;

  const usernames = Array.from(opened).map((panel) => getUsername(panel));
  const selectorsIamWatching = usernames.map(dataUsername).join(',');
  const selectorsWatchingMe = usernames
    .map(
      (id) => `body:has(#userList .userItem:where(${dataUsername(id)}) .eye-icon .isWatching) .jsPanel[data-username="${id}"]`
      // (id) => `body:has(#userList .userItem:where(${dataUsername(id)})) .jsPanel[data-username="${id}"]`
    )
    .join(', ');

  dynamicOpenedStyle.innerHTML = openPanelsCss
    .replace(/\[data-username="I_am_watching"\]/g, selectorsIamWatching)
    .replace(/\.user_watching_me/g, selectorsWatchingMe);
}
