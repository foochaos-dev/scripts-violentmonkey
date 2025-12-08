import { topRandom } from './utils/sortFunctions';
import rawCss from './styles/static.css?inline';
import { getCandidates, openCandidates } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import { observePanels } from './features/observeOpenPanels';
import { observeChatNav } from './features/observeChat';

export async function main() {
  GM_addStyle(rawCss);
  observeChatNav();
  observePanels();

  await waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') === 'false');
  await waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') !== 'false');

  setupTools();
  openCandidates(getCandidates(topRandom));
}
