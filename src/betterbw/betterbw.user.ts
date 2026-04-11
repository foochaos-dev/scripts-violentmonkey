import { topRandom } from './utils/sortFunctions';
import staticCss from './styles/static.css?inline';
import { getCandidates, openCandidates } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import { observePanels } from './features/observeOpenPanels';
import { observeChatNav } from './features/observeChat';

export async function main() {
  GM.addStyle(staticCss);
  observeChatNav();
  observePanels();

  await waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') === 'false').then(() => waitToBe('#roomsModal'));

  await setupTools();
  openCandidates(await getCandidates(topRandom));
}
