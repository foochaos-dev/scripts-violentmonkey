import { render } from 'preact';
import { queryPanels } from './utils/openPanel';
import { MenuActions } from './features/panelActions';
import { spyOn, type Watchers } from './utils/spyOn';
import { isOnCooldown } from './features/cooldown';
import { setNextCam } from './features/observeOpenPanels';
import { getUserById } from './utils/scrappers';
import { AlgoControls } from './features/globalActions';
import { spyOnConfig } from './features/spyOnConfig';
import type { ChatHTML5Type } from './types/ChatHTML5';

function setupHeader() {
  const header = $('#header .header-custom-btns')[0];
  if (!header) return;

  const controls = document.createElement('div');
  controls.id = 'bbw_controls';
  header.prepend(controls);

  render(<AlgoControls />, controls);
}

function setupUserMenu() {
  const userMenu = $('#userMenu')[0];
  if (!userMenu) return;

  const controls = document.createElement('div');
  controls.id = 'bbw_controls';
  userMenu.appendChild(controls);
  render(<MenuActions />, controls);

  chatHTML5.myUser = spyOn(chatHTML5.myUser, {
    selectedUserid: (selectedUserid) => {
      const nuser = getUserById(selectedUserid);
      if (!nuser) return;
      userMenu.dataset.username = nuser.username;
      userMenu.dataset.status = GM_getValue(`${nuser.username}_status`);
      userMenu.dataset.isCooldown = Boolean(isOnCooldown(nuser.username)).toString();
      userMenu.dataset.privateCam = Boolean(!nuser.obj.webcamPublic).toString();
    },
  }).proxy;
}

function setupSidebar() {
  const userList = document.getElementById('userList');
  if (!userList) return;

  $(userList).on('click', '.webcamBtn', function (event) {
    const opened = queryPanels();
    const webcamMax = +chatHTML5.roles.user.webcamMax;
    if (opened.length < webcamMax) return;

    const nextUser = $(this).closest<HTMLDivElement>('.userItem')[0];
    if (nextUser) {
      // event.preventDefault();
      event.stopPropagation();
      // event.stopImmediatePropagation();
      setNextCam(nextUser);

      const panel = $(`[data-grid-index="${webcamMax - 1}"]`)[0];
      if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
    }
  });

  // Prevent accidental clicks on the eye icon
  $(userList).on('click', '.fa-eye.fa-2x', function (e) {
    if (e.shiftKey) return;

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  });
}

export const ConfigWatchers: Watchers<ChatHTML5Type['config']> = {};

export function setupTools() {
  chatHTML5.config.timeBeforeWatchingCamAgain = '1000';
  chatHTML5.config.checkOwnStream = '1';
  chatHTML5.config.showCountryFlag = '1';
  chatHTML5.roles.user.webcamMax = GM_getValue('user.webcamMax', 10);
  const { revoke } = spyOnConfig(ConfigWatchers);

  // @ts-expect-error -- fix unreacheable code warning
  chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();

  setupHeader();
  setupUserMenu();
  setupSidebar();

  $('#sortWebcamtBtn').trigger('click');

  return revoke;
}
