import { render } from 'preact';
import { PANEL_SELECTOR, queryPanels } from './utils/openPanel';
import { MenuActions } from './features/panelActions';
import { spyOn, type Watchers } from './utils/spyOn';
import { isOnCooldown } from './features/cooldown';
import { setNextCam } from './features/observeOpenPanels';
import { getUserById } from './utils/scrappers';
import { AlgoControls } from './features/globalActions';
import { spyOnConfig } from './features/spyOnConfig';
import type { ChatHTML5Type } from './types/ChatHTML5';
import { trackWatchStats } from './features/watchStats';
import { WatchStats } from './features/watchStatsDisplay';
import watchStatsCss from './styles/watchStats.css?inline';

async function setupHeader() {
  const header = $('#header .header-custom-btns')[0];
  if (!header) return;

  const controls = document.createElement('div');
  controls.id = 'bbw_header_controls';
  header.prepend(controls);

  render(<AlgoControls />, controls);
}

async function setupUserMenu() {
  const userMenu = $('#userMenu')[0];
  if (!userMenu) return;

  const controls = document.createElement('div');
  controls.id = 'bbw_menu_controls';
  userMenu.appendChild(controls);
  render(<MenuActions />, controls);

  chatHTML5.myUser = spyOn(chatHTML5.myUser, {
    selectedUserid: async (selectedUserid) => {
      const nuser = getUserById(selectedUserid);
      if (!nuser) return;
      userMenu.dataset.status = await GM.getValue(`${nuser.username}_status`);
      userMenu.dataset.username = nuser.username;
      userMenu.dataset.isCooldown = Boolean(await isOnCooldown(nuser.username)).toString();
      userMenu.dataset.privateCam = Boolean(!nuser.obj.webcamPublic).toString();
    },
  }).proxy;
}

async function setupSidebar() {
  const userList = document.getElementById('userList');
  if (!userList) return;

  $(userList).on('click', '.webcamBtn', function (event) {
    if (event.shiftKey) return;

    const webcamNumber = chatHTML5.getWebcamNumber();
    const webcamMax = +chatHTML5.roles.user.webcamMax;
    if (webcamNumber < webcamMax) return;

    const nextUser = $(this).closest<HTMLDivElement>('.userItem')[0];
    if (!nextUser?.dataset.id) return;

    const user = getUserById(nextUser.dataset.id);
    if (!user) return;

    if (user.obj.webcamPublic) {
      // event.preventDefault();
      event.stopPropagation();
      // event.stopImmediatePropagation();
      setNextCam(nextUser);
      const panel = getPanelToClose(webcamNumber);
      if (panel?.id) jsPanel.activePanels.getPanel(panel.id)?.close();
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

async function setupWatchStats() {
  const counter = document.getElementById('watchAtMe');
  if (!counter) return;

  GM.addStyle(watchStatsCss);
  const stats = document.createElement('span');
  stats.id = 'bbw_watch_stats';
  counter.after(stats);
  render(<WatchStats />, stats);

  await trackWatchStats();
}

export const ConfigWatchers: Watchers<ChatHTML5Type['config']> = {};

function getPanelToClose(webcamNumber: number) {
  if (webcamNumber <= 0) return null;

  const optionA = $(`${PANEL_SELECTOR}:not(.user_watching_me)[data-status="--"]`)[0];
  if (optionA) return optionA;

  for (let i = webcamNumber; i > 0; i--) {
    const optionB = $(`${PANEL_SELECTOR}[data-grid-index="${i}"]`)[0];
    if (optionB) return optionB;
  }

  const panels = queryPanels();
  return panels[panels.length - 1] || null;
}

export async function setupTools() {
  chatHTML5.config.timeBeforeWatchingCamAgain = '1000';
  chatHTML5.config.checkOwnStream = '1';
  chatHTML5.config.showCountryFlag = '1';
  chatHTML5.roles.user.webcamMax = GM_getValue('user.webcamMax', 10);
  const { revoke } = spyOnConfig(ConfigWatchers);

  // @ts-expect-error -- fix unreacheable code warning
  chatHTML5.amIMuted = () => chatHTML5.myUser.mutedUntil > Date.now();

  await Promise.all([setupHeader(), setupUserMenu(), setupSidebar(), setupWatchStats()]);

  $('#sortWebcamtBtn').trigger('click');

  return revoke;
}
