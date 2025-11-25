// ==UserScript==
// @name        Better bateworld.com
// @namespace   Circlejerk Scripts
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_listValues
// @version     1.3.0
// @author      -
// @description 21/10/2025, 20:41:33
// @license GPL-3.0-or-later
// ==/UserScript==


GM_addStyle(`
.panel-action {
  position: absolute;
  left: 3px;
}

.panel-action-btn {
  cursor: pointer;
  margin-left: 8px;
  background: rgba(255, 255, 255, 0.8);
  color: inherit;
  font-size: 14px;

  float: right;
  position: relative;
  border: 1px solid #DDD;
  top: 2px;
  height: 15px;
  line-height: 0;
  opacity: 1;
  transition: opacity .2s ease-out;
}

.panel-action-btn:where(
  [data-status-value="--"],
  [data-status-value="-"],
  [data-status-value="+"],
  [data-status-value="++"]
) {
  margin-left: 0;
}

.jsPanel:not(:hover) .panel-action-btn {
  opacity: 0;
}

.jsPanel .speaks {
    width: 2px;
}

.jsPanel .jsPanel-content {
    background: #111;
}

:where(#userMenu, .jsPanel)[data-status="--"] [data-status-value="--"] { background: rgba(205, 0, 0, 1); color: #fff;}
:where(#userMenu, .jsPanel)[data-status="-"] [data-status-value="-"] { background: rgba(237, 146, 0, 1); color: #fff;}
:where(#userMenu, .jsPanel)[data-status="+"] [data-status-value="+"] { background: rgba(0, 167, 228, 1); color: #fff;}
:where(#userMenu, .jsPanel)[data-status="++"] [data-status-value="++"] { background: rgba(149, 50, 255, 1); color: #fff;}
.jsPanel[data-status="undefined"] .jsPanel-title {
  text-decoration-color: orange;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-thickness: 2px;
}

.jsPanel[data-status="undefined"] button:where([data-status-value="++"]) { display: none; }
.jsPanel[data-status="--"] button:where([data-status-value="++"]) { display: none; }
.jsPanel[data-status="-"]  button:where([data-status-value="++"]) { display: none; }
.jsPanel[data-status="+"]  button:where([data-status-value="--"]) { display: none; }
.jsPanel[data-status="++"] button:where([data-status-value="--"]) { display: none; }

.jsPanel:where([data-rotation=""],[data-rotation="0"]) video { rotate: 0deg; }
.jsPanel[data-rotation="90"] video { rotate: 90deg; }
.jsPanel[data-rotation="180"] video { rotate: 180deg; }
.jsPanel[data-rotation="270"] video { rotate: 270deg; }

.slide_block {
  width: 14px;
}

#userList .userItem {
  border-bottom: none;
}
#userList .userLabel {
  top: 0;
}

#userList .userItem:has(i.lock.fa-lock) .userAvatarContainer {
  --bg-color: rgba(205, 0, 0, 0.75);
  &:before {
    content: '';
    display: block;
    position: absolute;
    width: 5px;
    height: calc(100% - 2px);
    background: var(--bg-color);
    right: -6px;
    top: -4px;
    border-top-left-radius: 60px;
    border-bottom-left-radius: 60px;
  }
}

.jsPanel {
  box-shadow: none;
  border-color: #888 !important;
}

#tabsAndFooter {
  width: min(50%, 800px);
}

video.mobile.mobile {
  max-width: 100% !important;
  max-height: 100% !important;
}

.jsPanel-headerbar {
  min-height: 18px;
}

.jsPanel-titlebar {
  min-height: 16px;
}

.jsPanel-titlebar h3 {
  margin-block: 1px;
}
`);

const dataUsername = id => `[data-username="${id}"],[data-username^="${id}_"]`;

/** @type {'' | 'new' | 'top'} */
let algo = '';
const dynamicStyle = GM_addStyle(getCSS());
const dynamicOpenedStyle = GM_addStyle();

const PANEL_SELECTOR = '.jsPanel.jsPanel-theme-default';

// Action definitions: label and handler per action
const PANEL_ACTIONS = [
  {
    icon: '--',
    label: 'Nope\nDo not suggest this person.',
    handler: ({id, panel}) => {
      GM_setValue(`${id}_status`, '--');
      dynamicStyle.innerHTML = getCSS();

      if (!panel) return;
      panel.dataset.status = '--';
      jsPanel.activePanels.getPanel(panel.id)?.close();
    }
  },
  {
    icon: '-',
    label: 'So so\nIt depends on the day, on the mood...',
    handler: ({id, panel}) => {
      GM_setValue(`${id}_status`, '-');
      dynamicStyle.innerHTML = getCSS();

      if (!panel) return;
      panel.dataset.status = '-';
    }
  },
  {
    icon: '+',
    label: 'Yeah\nI liked you, buddy',
    handler: ({id, panel}) => {
      GM_setValue(`${id}_status`, '+');
      dynamicStyle.innerHTML = getCSS();

      if (!panel) return;
      panel.dataset.status = '+';
    }
  },
  {
    icon: '++',
    label: 'Ohhh Yeah!\nI liked you a lot, buddy!',
    handler: ({id, panel}) => {
      GM_setValue(`${id}_status`, '++');
      dynamicStyle.innerHTML = getCSS();

      if (!panel) return;
      panel.dataset.status = '++';
    }
  },
  {
    icon: '⟳',
    label: 'Rotate',
    handler: ({id, panel}) => {
      if (!panel) return;

      const currentRotation = getRotation(panel);
      const newRotation = (currentRotation + 90) % 360;
      panel.dataset.rotation = newRotation;

      GM_setValue(`${id}_rotation`, newRotation);
    }
  },
  {
    icon: '⏱',
    label: 'Cooldown 15m\nDo not suggest this person for the next 15 minutes',
    handler: cooldownIt
  },
].reverse();

function cooldownIt({id, minutes = 15, panel}) {
  const expiry = Date.now() + minutes * 60 * 1000;
  setCooldown(id, expiry);
  console.log(`User ${id} put on cooldown until`, new Date(expiry).toISOString());

  if (!panel) return;
  jsPanel.activePanels.getPanel(panel.id)?.close();
};

// Observe DOM for dynamic panels
const observerPanels = new MutationObserver(mutations => {
  let cleanupNeeded = false;

  for (const mutation of mutations) {
    // Handle added nodes
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const panels = node.matches(PANEL_SELECTOR)
        ? [node]
        : node.querySelectorAll(PANEL_SELECTOR);
      if (!panels.length) continue;
      panels.forEach(attachPanelActions);
      cleanupNeeded = true;
    }

    // Handle removed nodes
    for (const node of mutation.removedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const panels = node.matches(PANEL_SELECTOR)
        ? [node]
        : node.querySelectorAll(PANEL_SELECTOR);
      if (!panels.length) continue;
      panels.forEach(cleanupPanel);
      cleanupNeeded = true;
      if (algo) {
        setTimeout(() => {
          document.querySelector(`button[data-sort-order="${algo}"]`)?.click();
        }, 32);
      }
    }
  }

  if (cleanupNeeded) updateCssForOpenedPanels();
});

observerPanels.observe(document.body, { childList: true, subtree: false,  });

// Attach control buttons for each declared action
function attachPanelActions(panel) {
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

  getPanelActions({id, panel})
    .forEach(action => actions.appendChild(action));

  header.appendChild(actions);

  panel.dataset.actionsAttached = '1';
  panel.dataset.rotation = GM_getValue(`${id}_rotation`);

  panel.querySelector('video').volume = 0.08;

  panel.querySelector('.jsPanel-btn.jsPanel-btn-close')?.addEventListener('click', () => {cooldownIt({id, minutes: 1});});
}

function getPanelActions(data) {
  return PANEL_ACTIONS.map(action => {
    const btn = document.createElement('button');
    btn.dataset.statusValue = action.icon;
    btn.textContent = action.icon;
    btn.title = action.label;
    btn.className = 'panel-action-btn';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      action.handler(data);
    });
    return btn;
  });
}

function getMenuActions() {
  return PANEL_ACTIONS
    .filter(action => !['Rotate'].includes(action.label))
    .map(action => {
      const btn = document.createElement('button');
      btn.dataset.statusValue = action.icon;
      btn.textContent = action.icon;
      btn.title = action.label;
      btn.className = 'panel-action-btn';
      btn.addEventListener('click', e => {
        e.stopPropagation();
        action.handler({ id: getLatestUser(), panel: null });
      });
      return btn;
    });
}

function cleanupPanel(panel) {
}

function updateCssForOpenedPanels() {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  if (!openedPanels?.length) return;

  const usernames = Array.from(openedPanels).map(panel => getUsername(panel));
  dynamicOpenedStyle.innerHTML = `
.userItem:where(${usernames.map(dataUsername).join(',')}) {
  #userList & .webcamBtn {
    background: rgba(80, 206, 133, 1) !important;
  }

  #tabs &:before {
    content: '';
    display: block;
    position: absolute;
    width: 12px;
    height: 11px;
    top: 50%;
    transform: translateY(-50%) translateX(-120%);
    border-radius: 2px;
    border: rgba(178, 178, 178, 1) solid 1px;
    border-top-width: 3px;
  }
}

${usernames.map(id =>
  `body:has(#userList .userItem:where(${dataUsername(id)}) .eye-icon .isWatching) .jsPanel[data-username="${id}"]`
).join(', ')}  {
  box-shadow: rgba(255, 206, 50, 1) 0px 0px 2px 3px;
  transition: box-shadow .2s ease-out;

  & .jsPanel-title::before {
    content: "👁️";
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    text-shadow: 0 0 4px rgba(0, 150, 100, 1);
    font-size: 14px;
  }
}
`;
}

// Utility
function getRotation(element) {
  if (!element || !element.dataset.rotation) return 0;
  return parseInt(element.dataset.rotation, 10) || 0;
}

function getUsername(panel) {
  const title = panel.querySelector('.jsPanel-title');
  const username = title.childNodes.values().find(e => e.nodeType === 3 && e.nodeValue.trim()).nodeValue.trim();
  return username.split('_')[0];
}

function getCSS() {
  const arrayOfKeys = GM_listValues().filter(key => key.match(/\.*?_status/));
  const values = GM_getValues(arrayOfKeys);

  const groups = {'--': [], '-': [], '+': [], '++': []};
  for(const [key, value] of Object.entries(values)) {
    const [id] = key.split('_');
    groups[value].push(id);
  }

  const userItems = group => `.userItem:where(${group.map(dataUsername).join(',')})`;

  const css = `
#tabs .userItem,
#userList .userItem {
  --text-decoration: line-through solid 1.8rem;
  --decoration-opacity: 0.2;
}

${userItems(groups['--'])} {
  #userList & {
    opacity: 0.3 !important;
  }
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(205, 0, 0, 0.15);
  }
}

${userItems(groups['-'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(237, 146, 0, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(237, 146, 0, var(--decoration-opacity));
  }
}

${userItems(groups['+'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(0, 100, 255, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(0, 100, 255, var(--decoration-opacity));
  }
}

${userItems(groups['++'])} {
  #tabs &:first-child {
    text-decoration: var(--text-decoration) rgba(149, 50, 255, var(--decoration-opacity));
  }

  #userList & .userLabel {
    background: rgba(149, 50, 255, var(--decoration-opacity));
  }
}
`;

  return css;
}

// Cooldown helpers: store expiry timestamps (ms since epoch) using GM_setValue
function setCooldown(id, expiryMs) {
  GM_setValue(`${id}_cooldown`, expiryMs);
}

function getCooldownExpiry(id) {
  const val = GM_getValue(`${id}_cooldown`);
  return val ? Number(val) : null;
}

function isOnCooldown(id) {
  const expiry = getCooldownExpiry(id);
  return expiry && Date.now() < expiry;
}

const topNewest = (a, b) => b.bias - a.bias || b.onlineSince - a.onlineSince;
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

const getCandidates = (
  /** @type {function({item: HTMLDivElement, id: string, status: string, bias: number, onlineSince: number}, {item: HTMLDivElement, id: string, status: string, bias: number, onlineSince: number}): number} */
  compareFn = topRandom,
  _biases = {}
) => {
  const biases = {
    // "--": 0,
    "-": 1,
    [undefined]: 2,
    "+": 3,
    "++": 4,
    ..._biases
  };
  /** @type {NodeList} */
  const userItems = document.querySelectorAll('#userList [data-status="online"][data-webcam="true"]:not(:has(.fa.fa-lock))');
  const entries = [];
  for (const /** @type {HTMLDivElement} */ item of userItems.values()) {
    const id = item.dataset.username.split('_')[0];
    const status = GM_getValue(`${id}_status`);
    // skip users explicitly faded out
    if (status === "--") continue;
    // skip users currently on cooldown
    if (isOnCooldown(id)) continue;

    entries.push({
      item,
      id,
      status,
      bias: biases[status],
      onlineSince: parseInt(item.querySelector('.userLabel [data-date]')?.dataset.date || 0),
    });
  }

  entries.sort(compareFn);

  return entries;
};

function openCandidates(candidates, /** @type {number} */ limit) {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  let openedCount = openedPanels.length || 0;
  if (openedCount >= 10) return console.log('10 panels already open');
  const maxToOpen = limit ? Math.min(openedCount + limit, 10) : 10;

  const openedIds = new Set(Array.from(openedPanels).map(panel => getUsername(panel)));
  while (openedCount < maxToOpen && candidates.length > 0) {
    const candidate = candidates.shift();
    if (openedIds.has(candidate.id)) continue;

    tryToOpenPanel(candidate);
    openedCount++;
  }

  organizePanels();
}

function tryToOpenPanel(
  /** @type {{item: HTMLDivElement, id: string, status: string, bias: number, onlineSince: number}} */ candidate
) {
  // console.log('Trying to open panel for', candidate.id);
  candidate.item.querySelector('.webcamBtn').click();
}

function setupTools() {
  const header = document.querySelector('#header .header-custom-btns');

  {
    const button = document.createElement('button');
    button.textContent = 'ø';
    button.title = 'Organize open panels and stop the algorithm';
    button.addEventListener('click', () => {
      organizePanels();
      algo = '';
    });
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'New';
    button.dataset.sortOrder = 'new';
    button.title = 'Prioritize recently online';
    button.addEventListener('click', () => {
      algo = 'new';
      openCandidates(getCandidates(topRandom, { [undefined]: 9, '+': 8 }));
    });
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'Top';
    button.dataset.sortOrder = 'top';
    button.title = 'Prioritize users, then randomize the order';
    button.addEventListener('click', () => {
      algo = 'top';
      openCandidates(getCandidates(topRandom));
    });
    header.prepend(button);
  }

  chatHTML5.config['timeBeforeWatchingCamAgain'] = "1000";
  chatHTML5.config['checkOwnStream'] = "1";
  chatHTML5.config['showCountryFlag'] = "1";
  document.querySelector('#sortWebcamtBtn')?.click();

  const userMenu = document.querySelector('#userMenu');
  if (userMenu) {
    getMenuActions().forEach(action => userMenu.appendChild(action));

    chatHTML5.myUser = spyOn(chatHTML5.myUser, 'selectedUserid', (selectedUserid) => {
      const el = document.querySelector(`#userList .userItem[data-id="${selectedUserid}"]`);
      if (!el || !el.dataset.username) return;

      const id = el.dataset.username.split('_')[0];
      userMenu.dataset.username = id;
      userMenu.dataset.status = GM_getValue(`${id}_status`);
    });
  }
}

function spyOn(obj, key, callback) {
  // Define the handler for intercepting the set operation on selectedUserid
  const handler = {
    set(target, prop, value) {
      // If the `key` changed, trigger the callback
      if (prop === key && target[prop] !== value) {
        callback(value);
      }

      // Proceed with the default behavior of setting the property
      target[prop] = value;
      return true;
    }
  };

  // Create a proxy to observe the changes
  return new Proxy(obj, handler);
}

function getLatestUser() {
  try {
    return chatHTML5.myUser.id.split('_')[0];
  } catch (e) {
    console.error('Oooops...');
  }

  const muteItem = document.querySelector('#userMenu [data-action="mute"]');
  const username = muteItem.textContent.split(' ').at(-1).split('_').at(0);
  return username;
}

const base = { my: 'right-top', at: 'right-top' };
const gridStyle = {
  marginTop: 50,
  marginRight: 5,
  gapX: 5,
  gapY: 5,
  width: 365,
  height: 318,
};
const col = [
  - gridStyle.marginRight,
  - (gridStyle.marginRight + gridStyle.width+gridStyle.gapX),
  - (gridStyle.marginRight + (gridStyle.width+gridStyle.gapX) * 2),
  - (gridStyle.marginRight + (gridStyle.width+gridStyle.gapX) * 3),
];
const row = [
  gridStyle.marginTop,
  gridStyle.marginTop + gridStyle.height + gridStyle.gapY,
  gridStyle.marginTop + (gridStyle.height + gridStyle.gapY) * 2,
];
const positions3x3plus1 = [
  () => ({ ...base, offsetX: col[0], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[0], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[0] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[1] }),
  () => ({ ...base, offsetX: col[0], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[1], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[2], offsetY: row[2] }),
  () => ({ ...base, offsetX: col[3], offsetY: 65 }),
];

function organizePanels(positions = positions3x3plus1) {
  const opened = Array.from(document.querySelectorAll(PANEL_SELECTOR));
  if (!opened?.length) return;

  const GRID_SIZE = 10;
  const grid = Array(GRID_SIZE).fill(null);

  // Split the opened panels in two groups
  const groups = { prePositioned: [], newlyCreated: [] };
  for (const panel of opened) {
    const group = panel.dataset.gridIndex ? groups.prePositioned : groups.newlyCreated;
    group.push(panel);
  }

  // Put the pre-positioned panels back on the same index
  for (const panel of groups.prePositioned) {
    if (grid[+panel.dataset.gridIndex]) {
      groups.newlyCreated.unshift(panel);
    } else {
      grid[+panel.dataset.gridIndex] = panel;
    }
  }

  for (const panel of groups.newlyCreated) {
    const nextAvailableSlot = grid.indexOf(null);
    if (nextAvailableSlot > -1) {
      grid[nextAvailableSlot] = panel;
      panel.dataset.gridIndex = nextAvailableSlot.toString();
    }
  }

  grid
    .map(panel => panel ? jsPanel.activePanels.getPanel(panel.id) : null)
    .forEach((panel, idx, grid) => {
      if (!panel) return;

      const positionFn = positions[idx];
      if (!positionFn) return;

      panel.resize({ width: gridStyle.width, height: gridStyle.height }).reposition(positionFn(grid));
    });

}

function waitToBe(
  /** @type {string} */ selector,
  /** @type {string[]} */ attributeFilter = ['aria-hidden'],
  /** @type {function(HTMLElement): boolean} */ predicate = el => el.getAttribute('aria-hidden') !== 'false',
) {
  return new Promise(resolve => {
    let attrObserver = null;
    let domObserver = null;

    function cleanup() {
      if (attrObserver) { attrObserver.disconnect(); attrObserver = null; }
      if (domObserver) { domObserver.disconnect(); domObserver = null; }
    }

    function attachAttrObserver(el) {
      if (!el) return false;
      if (predicate(el)) {
        cleanup();
        resolve(el);
        return true;
      }
      // Watch for attribute changes
      attrObserver = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes' && attributeFilter.includes(m.attributeName)) {
            if (predicate(el)) {
              cleanup();
              resolve(el);
              return;
            }
          }
        }
      });
      attrObserver.observe(el, { attributes: true, attributeFilter });
      return false;
    }

    // If element already exists, attach attribute observer
    const existing = document.querySelector(selector);
    if (attachAttrObserver(existing)) return;

    // Otherwise watch for element being added to the DOM
    domObserver = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const found = node.matches(selector) ? node : node.querySelector(selector);
          if (!found) continue;
          if (attachAttrObserver(found)) {
            if (domObserver) { domObserver.disconnect(); domObserver = null; }
            return;
          }
        }
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  });
}

// Initialize existing panels
document.querySelectorAll(PANEL_SELECTOR).forEach(attachPanelActions);

Promise.resolve()
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], el => el.getAttribute('aria-hidden') === 'false'))
  .then(() => waitToBe('#roomsModal', ['aria-hidden'], el => el.getAttribute('aria-hidden') !== 'false'))
  .then(() => {
    console.log('Rooms modal is now hidden');
    setupTools();
    openCandidates(getCandidates(topRandom));
  });
