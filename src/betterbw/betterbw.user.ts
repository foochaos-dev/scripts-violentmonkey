import { setRoomSelected } from './utils/openPanel';
import { waitToBe } from './utils/waitToBe';
import { setupTools } from './setupTools';
import { observePanels } from './features/observeOpenPanels';
import { observeChatNav } from './features/observeChat';
import { debounce } from './utils/debounce';
import { sweepExpiredCooldowns } from './features/cooldown';
import { setupResponsiveLayout } from './features/responsiveLayout';
import { batchUserListRebuilds } from './features/fastUserList';
import { setupCamCleanup } from './features/camCleanup';
import { lightenTimers } from './features/lighterTimers';
import { applySiteOptions, getSetting } from './features/settings';
import { closeCamsUntil } from './features/noCamsBeforeRoom';
import { setupDragToSwap } from './features/dragToSwap';
import { setupCamsMoveAway } from './features/camsMoveAway';
import { runAlgo } from './features/globalActions';
import staticCss from './styles/static.css?inline';
import topLevelCss from './styles/topLevel.css?inline';

export async function topLevelStyles() {
  GM.addStyle(topLevelCss);
}

function hacks() {
  chatHTML5.myUser.mutedUsers = chatHTML5.myUser.mutedUsers || '';

  const original_updateNumberUsersDisplay = chatHTML5.updateNumberUsersDisplay;
  chatHTML5.updateNumberUsersDisplay = debounce(original_updateNumberUsersDisplay);

  batchUserListRebuilds();
  setupCamCleanup();
  lightenTimers();
  applySiteOptions();
}

export async function main() {
  hacks();
  GM.addStyle(staticCss);
  sweepExpiredCooldowns();
  setupResponsiveLayout();
  observeChatNav();
  const roomSelected = waitToBe('#roomsModal', ['aria-hidden'], (el) => el.getAttribute('aria-hidden') === 'false').then(() =>
    waitToBe('#roomsModal')
  );
  closeCamsUntil(roomSelected);
  observePanels();
  // Before dragToSwap: its pointerdown handler measures the cams, once this one put them back on their spots
  setupCamsMoveAway();
  setupDragToSwap();

  await roomSelected;
  setRoomSelected();

  await setupTools();
  await runAlgo(getSetting('preferredAlgo'));
}
