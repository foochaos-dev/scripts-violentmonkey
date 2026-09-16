import { dataUsername } from './utils/formatters';
import { queryPanels } from './utils/openPanel';
import { getUsername } from './utils/scrappers';
import openPanelsCss from './styles/openPanels.css?raw';
import { isDefined } from './utils/filters';

const dynamicOpenedStyle = GM_addStyle('');

export function updateCssForOpenedPanels() {
  const opened = queryPanels();
  if (!opened?.length) return;

  const usernames = Array.from(opened)
    .map((panel) => getUsername(panel))
    .filter(isDefined);
  const selectorsIamWatching = usernames.map(dataUsername).join(',');

  const selectorsWatchingPrivateCams = usernames
    .map(
      (id) =>
        `body:has(#userList .userItem:where(${dataUsername(id)}) .webcamBtn.visible i.lock.fa-lock) .jsPanel[data-username="${id}"] .jsPanel-title>span:before`
    )
    .join(',');

  dynamicOpenedStyle.innerHTML = openPanelsCss.replace(/(\.watching_private_cam|\[data-username="I_am_watching"\])/g, (arg) => {
    switch (arg) {
      case '.watching_private_cam':
        return selectorsWatchingPrivateCams;
      case '[data-username="I_am_watching"]':
        return selectorsIamWatching;
      default:
        return arg;
    }
  });
}
