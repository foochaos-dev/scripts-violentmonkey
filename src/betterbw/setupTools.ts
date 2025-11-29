import { openCandidates, getCandidates, queryPanels } from './utils/openPanel';
import { setAlgo } from './algo';
import { getMenuActions } from './features/panelActions';
import { organizePanels } from './utils/organizePanels';
import { topRandom } from './utils/sortFunctions';
import { spyOn } from './utils/spyOn';
import { isOnCooldown } from './features/cooldown';
import { setNextCam } from './features/observeOpenPanels';

function setupHeader() {
  const header = document.querySelector<HTMLElement>('#header .header-custom-btns');
  if (!header) return;

  {
    const button = document.createElement('button');
    button.textContent = 'ø';
    button.dataset.sortOrder = '';
    button.title = 'Organize open panels and stop the algorithm';
    button.addEventListener('click', () => {
      organizePanels();
      setAlgo('');
    });
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'New';
    button.dataset.sortOrder = 'new';
    button.title = 'Prioritize recently online';
    button.addEventListener('click', () => {
      setAlgo('new');
      openCandidates(getCandidates(topRandom, { undefined: 9, '+': 8 }));
    });
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'Top';
    button.dataset.sortOrder = 'top';
    button.title = 'Prioritize users, then randomize the order';
    button.addEventListener('click', () => {
      setAlgo('top');
      openCandidates(getCandidates(topRandom));
    });
    header.prepend(button);
  }
}

function setupUserMenu() {
  const userMenu = document.querySelector<HTMLDivElement>('#userMenu');
  if (!userMenu) return;

  getMenuActions().forEach((action) => userMenu.appendChild(action));

  chatHTML5.myUser = spyOn(chatHTML5.myUser, 'selectedUserid', (selectedUserid) => {
    const el = document.querySelector<HTMLDivElement>(`:where(#userList,#tabs) .userItem[data-id="${selectedUserid}"]`);
    if (!el || !el.dataset.username) return;

    const id = el.dataset.username.split('_')[0]!;
    userMenu.dataset.username = id;
    userMenu.dataset.status = GM_getValue(`${id}_status`);
    userMenu.dataset.isCooldown = Boolean(isOnCooldown(id)).toString();
    userMenu.dataset.privateCam = Boolean(
      document.querySelector(`#userList .userItem[data-id="${selectedUserid}"]:has(.webcamBtn.visible i.lock.fa-lock)`)
    ).toString();
  });
}

function setupSidebar() {
  $(document.getElementById('userList')!).on('click', '.webcamBtn', function (event) {
    const opened = queryPanels();
    if (opened.length < 10) return;

    const nextUser = $(this).closest<HTMLDivElement>('.userItem')[0];
    if (nextUser) {
      // event.preventDefault();
      event.stopPropagation();
      // event.stopImmediatePropagation();
      setNextCam(nextUser);

      const panel = document.querySelector('[data-grid-index="9"]');
      if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
    }
  });
}

export function setupTools() {
  setupHeader();
  setupUserMenu();
  setupSidebar();

  chatHTML5.config['timeBeforeWatchingCamAgain'] = '1000';
  chatHTML5.config['checkOwnStream'] = '1';
  chatHTML5.config['showCountryFlag'] = '1';
  document.querySelector<HTMLButtonElement>('#sortWebcamtBtn')?.click();
}
