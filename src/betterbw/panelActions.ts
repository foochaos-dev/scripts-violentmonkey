import { refreshDynamicStyle } from './dynamicStyle';
import { rotateCam } from './features/rotateCam';
import { cooldownIt } from './features/cooldown';
import { getUsername } from './utils/scrappers';

// Action definitions: label and handler per action
export const PANEL_ACTIONS = [
  {
    icon: '--',
    label: 'Nope\nDo not suggest this person.',
    handler: ({ id, panel }) => {
      GM_setValue(`${id}_status`, '--');
      refreshDynamicStyle();

      if (!panel) return;
      panel.dataset.status = '--';
      jsPanel.activePanels.getPanel(panel.id)?.close();
    },
  },
  {
    icon: '-',
    label: 'So so\nIt depends on the day, on the mood...',
    handler: ({ id, panel }) => {
      GM_setValue(`${id}_status`, '-');
      refreshDynamicStyle();

      if (!panel) return;
      panel.dataset.status = '-';
    },
  },
  {
    icon: '+',
    label: 'Yeah\nI liked you, buddy',
    handler: ({ id, panel }) => {
      GM_setValue(`${id}_status`, '+');
      refreshDynamicStyle();

      if (!panel) return;
      panel.dataset.status = '+';
    },
  },
  {
    icon: '++',
    label: 'Ohhh Yeah!\nI liked you a lot, buddy!',
    handler: ({ id, panel }) => {
      GM_setValue(`${id}_status`, '++');
      refreshDynamicStyle();

      if (!panel) return;
      panel.dataset.status = '++';
    },
  },
  {
    icon: '⟳',
    label: 'Rotate',
    handler: ({ id, panel }) => {
      if (!panel) return;
      rotateCam({ id, panel });
    },
  },
  {
    icon: '⏱',
    label: 'Cooldown 15m\nDo not suggest this person for the next 15 minutes',
    handler: cooldownIt,
  },
].reverse();

export function getPanelActions(data) {
  return PANEL_ACTIONS.map((action) => {
    const btn = document.createElement('button');
    btn.dataset.statusValue = action.icon;
    btn.textContent = action.icon;
    btn.title = action.label;
    btn.className = 'panel-action-btn';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      action.handler(data);
    });
    return btn;
  });
}

export function getMenuActions() {
  return PANEL_ACTIONS.filter((action) => !['Rotate'].includes(action.label)).map((action) => {
    const btn = document.createElement('button');
    btn.dataset.statusValue = action.icon;
    btn.textContent = action.icon;
    btn.title = action.label;
    btn.className = 'panel-action-btn';
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      const id = getLatestUser();
      if (id != null) action.handler({ id, panel: null });
    });
    return btn;
  });
}

function getLatestUser() {
  try {
    return chatHTML5.myUser.id.split('_')[0];
  } catch (e) {
    console.error('Oooops...');
  }

  const muteItem = document.querySelector('#userMenu [data-action="mute"]');
  if (!muteItem) return;

  const username = muteItem.textContent.split(' ').at(-1)?.split('_').at(0);
  return username;
}

// Attach control buttons for each declared action
export function attachPanelActions(panel: HTMLDivElement) {
  if (panel.dataset.actionsAttached === '1') return;

  const panelJS = jsPanel.activePanels.getPanel(panel.id);
  if (!panelJS) return console.warn('Panel not found for', panel.id);
  panelJS.resize({ width: 365, height: 318 });

  const header = panel.querySelector('.jsPanel-hdr .jsPanel-title');
  if (!header) return;

  const id = getUsername(panel);
  panel.dataset.username = id;
  panel.dataset.status = GM_getValue(`${id}_status`);

  const actions = document.createElement('div');
  actions.className = 'panel-action';

  getPanelActions({ id, panel }).forEach((action) => actions.appendChild(action));

  header.appendChild(actions);

  panel.dataset.actionsAttached = '1';
  panel.dataset.rotation = GM_getValue(`${id}_rotation`);

  panel.querySelector('.jsPanel-btn.jsPanel-btn-close')?.addEventListener('click', () => {
    cooldownIt({ id, minutes: 1 });
  });

  const video = panel.querySelector('video');
  if (video) video.volume = 0.08;
}

export function cleanupPanel(panel: HTMLDivElement) {}
