import { topRandom } from './utils/sortFunctions';
import staticCss from './styles/static.css?inline';
import topLevelCss from './styles/topLevel.css?inline';
import { getCandidates, openCandidates } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import { observePanels } from './features/observeOpenPanels';
import { observeChatNav } from './features/observeChat';
import { debounce } from './utils/debounce';

export async function topLevelStyles() {
  GM.addStyle(topLevelCss);
}

function hacks() {
  chatHTML5.myUser.mutedUsers = chatHTML5.myUser.mutedUsers || '';

  const original_updateNumberUsersDisplay = chatHTML5.updateNumberUsersDisplay;
  chatHTML5.updateNumberUsersDisplay = debounce(original_updateNumberUsersDisplay);
}

export async function main() {
  hacks();
  GM.addStyle(staticCss);
  observeChatNav();
  observePanels();

  await waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') === 'false').then(() => waitToBe('#roomsModal'));

  await setupTools();
  openCandidates(await getCandidates(topRandom));
}
