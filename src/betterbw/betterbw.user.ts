import { topRandom } from './utils/sortFunctions';
import rawCss from './style.css?raw';
import { attachPanelActions } from './panelActions';
import { getCandidates, openCandidates, PANEL_SELECTOR } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import './observers';

GM_addStyle(rawCss);

// Initialize existing panels
document.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR).forEach(attachPanelActions);

Promise.resolve()
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], el => el.getAttribute('aria-hidden') === 'false'))
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], el => el.getAttribute('aria-hidden') !== 'false'))
  .then(() => {
    setupTools();
    openCandidates(getCandidates(topRandom));
  });
