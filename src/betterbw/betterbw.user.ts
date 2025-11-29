import { topRandom } from './utils/sortFunctions';
import rawCss from './styles/static.css?raw';
import { getCandidates, openCandidates } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import { observePanels } from './features/observeOpenPanels';

GM_addStyle(rawCss);

observePanels();

const whenRoomsModalClosed = Promise.resolve()
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') === 'false'))
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') !== 'false'));

whenRoomsModalClosed.then(() => {
  setupTools();
  openCandidates(getCandidates(topRandom));
});
