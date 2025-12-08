import { updateCssForOpenedPanels } from '../dynamicOpenedStyle';
import { PANEL_SELECTOR } from '../utils/openPanel';
import { attachPanelActions, cleanupPanel } from './panelActions';
import { organizePanels } from '../utils/organizePanels';
import { tabFocused, whenTabFocused } from './tabFocus';
import { observeIt } from '../utils/observeIt';
import { clickOnCurrentAlgoButton } from './globalActions';

let nextUser: HTMLDivElement | null = null;
export const setNextCam = (val: HTMLDivElement) => (nextUser = val);

let clickRequested = false;

export function observePanels() {
  return observeIt({
    target: document.body,
    selector: PANEL_SELECTOR,
    forEachAddedNode: attachPanelActions,
    forEachRemovedNode: cleanupPanel,
    cleanup: ({ nodesAdded, nodesRemoved }) => {
      if (!nodesAdded && !nodesRemoved) return;

      organizePanels();

      if (nodesRemoved) {
        if (nextUser) {
          $('.webcamBtn.visible', nextUser).trigger('click');
          nextUser = null;
        } else if (tabFocused()) {
          clickOnCurrentAlgoButton();
        } else if (!clickRequested) {
          clickRequested = true;
          whenTabFocused(() => {
            clickRequested = false;
            clickOnCurrentAlgoButton();
          });
        }
      }

      updateCssForOpenedPanels();
    },
  });
}
