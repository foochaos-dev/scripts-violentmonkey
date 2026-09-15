import { updateCssForOpenedPanels } from '../dynamicOpenedStyle';
import { clickWebcamButton, PANEL_SELECTOR } from '../utils/openPanel';
import { attachPanelActions } from './panelActions';
import { organizePanels } from '../utils/organizePanels';
import { tabFocused, whenTabFocused } from './tabFocus';
import { observeIt } from '../utils/observeIt';
import { clickOnCurrentAlgoButton } from './globalActions';
import { markPanelsWatchingMe } from './watchingMe';
import { cleanupClosedCam } from './camCleanup';
import { endPeeks } from './camsMoveAway';

let nextUser: HTMLDivElement | null = null;
export const setNextCam = (val: HTMLDivElement) => (nextUser = val);

let clickRequested = false;

export function observePanels() {
  return observeIt({
    target: document.body,
    selector: PANEL_SELECTOR,
    forEachAddedNode: attachPanelActions,
    forEachRemovedNode: cleanupClosedCam,
    cleanup: ({ nodesAdded, nodesRemoved }) => {
      if (!nodesAdded && !nodesRemoved) return;

      // The cams that moved out of the pointer's way are about to be re-placed; they peek again on the next move
      endPeeks();
      organizePanels();

      if (nodesRemoved) {
        if (nextUser) {
          clickWebcamButton($('.webcamBtn.visible', nextUser));
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
      markPanelsWatchingMe();
    },
  });
}
