// ==UserScript==
// @name        Better bateworld.com
// @namespace   My Violentmonkey Scripts
// @match       https://bateworld.com//html5-chat/chat2/*
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_getValues
// @grant       GM_setValue
// @grant       GM_setValues
// @grant       GM_listValues
// @version     1.0
// @author      -
// @description 21/10/2025, 20:41:33
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

.jsPanel:not(:hover) .panel-action-btn {
  opacity: 0;
}

.jsPanel .speaks {
    width: 2px;
}

.jsPanel .jsPanel-content {
    background: #111;
}

.jsPanel[data-status="--"] [data-status-value="--"] { background: rgba(230, 200, 170);}
.jsPanel[data-status="-"] [data-status-value="-"] { background: rgba(220, 200, 200);}
.jsPanel[data-status="+"] [data-status-value="+"] { background: rgba(170, 200, 230);}
.jsPanel[data-status="++"] [data-status-value="++"] { background: rgba(150, 190, 250);}
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
.jsPanel[data-rotation="180"] video { transform: rotate(180deg); }
.jsPanel[data-rotation="270"] video { rotate: 270deg; }

#userList .userItem:has(i.lock.fa-lock) .userLabel {
  color: rgba(255, 0, 0, .75);
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

const dynamicStyle = GM_addStyle(getCSS());
const dynamicOpenedStyle = GM_addStyle();

const PANEL_SELECTOR = '.jsPanel.jsPanel-theme-default';

// Action definitions: label and handler per action
const PANEL_ACTIONS = [
  {
    icon: '--',
    label: 'Fade',
    handler: panel => {
      const id = getUsername(panel);
      panel.dataset.status = '--';
      GM_setValue(`${id}_status`, '--');
      dynamicStyle.innerHTML = getCSS();
    }
  },
  {
    icon: '-',
    label: 'Fade',
    handler: panel => {
      const id = getUsername(panel);
      panel.dataset.status = '-';
      GM_setValue(`${id}_status`, '-');
      dynamicStyle.innerHTML = getCSS();
    }
  },
  {
    icon: '+',
    label: 'Good',
    handler: panel => {
      const id = getUsername(panel);
      panel.dataset.status = '+';
      GM_setValue(`${id}_status`, '+');
      dynamicStyle.innerHTML = getCSS();
    }
  },
  {
    icon: '++',
    label: 'Top',
    handler: panel => {
      const id = getUsername(panel);
      panel.dataset.status = '++';
      GM_setValue(`${id}_status`, '++');
      dynamicStyle.innerHTML = getCSS();
    }
  },
  {
    icon: '⟳',
    label: 'Rotate',
    handler: panel => {
      const id = getUsername(panel);

      const currentRotation = getRotation(panel);
      const newRotation = (currentRotation + 90) % 360;
      panel.dataset.rotation = newRotation;

      GM_setValue(`${id}_rotation`, newRotation);
    }
  },
].reverse();

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
      console.log(node);
      if (!(node instanceof HTMLElement)) continue;
      const panels = node.matches(PANEL_SELECTOR)
        ? [node]
        : node.querySelectorAll(PANEL_SELECTOR);
      if (!panels.length) continue;
      panels.forEach(cleanupPanel);
      cleanupNeeded = true;
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

  PANEL_ACTIONS.forEach(action => {
    const btn = document.createElement('button');
    btn.dataset.statusValue = action.icon;
    btn.textContent = action.icon;
    btn.title = action.label;
    btn.className = 'panel-action-btn';
    btn.addEventListener('click', e => {
      e.stopPropagation();
      action.handler(panel);
    });
    actions.appendChild(btn);
  });

  header.appendChild(actions);

  panel.dataset.actionsAttached = '1';
  panel.dataset.rotation = GM_getValue(`${id}_rotation`);

  panel.querySelector('video').volume = 0.1;
}

function cleanupPanel(panel) {
}

function updateCssForOpenedPanels() {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  if (!openedPanels?.length) return;

  const usernames = Array.from(openedPanels).map(panel => getUsername(panel));
  dynamicOpenedStyle.innerHTML = `
  #userList .userItem:where(
  ${usernames.map(id => `[data-username="${id}"],[data-username^="${id}_"]`).join(',')}
) .webcamBtn {
  background: #50ce85 !important;
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

  const dataUsername = id => `[data-username="${id}"],[data-username^="${id}_"]`;

  const css = `#userList .userItem:where(
${groups['--'].map(dataUsername).join(',')}
) {
  opacity: 0.3 !important;
}

#userList .userItem:where(
${groups['-'].map(dataUsername).join(',')}
) .userLabel {
  color: rgba(0, 0, 0, 0.6);
}

#userList .userItem:where(
${groups['+'].map(dataUsername).join(',')}
) .userLabel {
  color: rgba(0, 0, 0, 1);
  font-weight: 700;
}

#userList .userItem:where(
${groups['++'].map(dataUsername).join(',')}
) .userLabel {
  color: rgba(0, 0, 230, 1);
  font-weight: 700;
}
`;

  return css;
}

const topNewest = (a, b) => b.bias - a.bias || b.onlineSince - a.onlineSince;
const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;

const getCandidates = (
  /** @type {function({item: HTMLDivElement, id: string, status: string, bias: number, onlineSince: number}, {item: HTMLDivElement, id: string, status: string, bias: number, onlineSince: number}): number} */
  compareFn = topRandom,
  _biases = {}
) => {
  const biases = {
    "--": 0,
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
    if (status === "--") continue;

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

function openCandidates(candidates) {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  let openedCount = openedPanels.length || 0;
  if (openedCount >= 10) return console.log('10 panels already open');

  const openedIds = new Set(Array.from(openedPanels).map(panel => getUsername(panel)));
  while (openedCount < 10 && candidates.length > 0) {
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
  console.log('Trying to open panel for', candidate.id);
  candidate.item.querySelector('.webcamBtn').click();
}

function setupTools() {
  const header = document.querySelector('#header .header-custom-btns');

  {
    const button = document.createElement('button');
    button.textContent = 'Grid';
    button.title = 'Organize open panels';
    button.addEventListener('click', () => organizePanels());
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'New';
    button.title = 'Prioritize recently online';
    button.addEventListener('click', () => openCandidates(getCandidates(topRandom, { [undefined]: 9, '+': 8 })));
    header.prepend(button);
  }

  {
    const button = document.createElement('button');
    button.textContent = 'Top Rand';
    button.title = 'Prioritize users, then randomize the order';
    button.addEventListener('click', () => openCandidates(getCandidates(topRandom)));
    header.prepend(button);
  }

  chatHTML5.config['timeBeforeWatchingCamAgain'] = "1000";
  document.querySelector('#sortWebcamtBtn')?.click();
}

const gapX = -5;
const gapY = 0;
const positions3x3plus1 = [
  () => ({ my: 'right-top', at: 'right-top', offsetX: -5, offsetY: 50 }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[0], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'left-top', of: grid[0], offsetX: gapX }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[2], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'left-top', of: grid[2], offsetX: gapX }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[4], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[1], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[3], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'right-bottom', of: grid[5], offsetY: gapY }),
  (grid) => ({ my: 'right-top', at: 'left-top', of: grid[4], offsetX: gapX, offsetY: 65 }),
];

function organizePanels(positions = positions3x3plus1) {
  const openedPanels = document.querySelectorAll(PANEL_SELECTOR);
  if (!openedPanels?.length) return;

  const positionedPanels = Array(10).fill(null);
  Array.from(openedPanels)
    // bubble up panels that already have a position
    .sort((a, b) => a.dataset.gridIndex ? -1 : b.dataset.gridIndex ? 1 : 0)
    .forEach((panelDOM) => {
      const panel = jsPanel.activePanels.getPanel(panelDOM.id);

      if (panelDOM.dataset.gridIndex) {
        positionedPanels[+panelDOM.dataset.gridIndex] = panel;
        return;
      }

      const placementIndex = positionedPanels.indexOf(null);
      const positionFn = positions[placementIndex];
      if (!positionFn) return;
      positionedPanels[placementIndex] = panel;
      panelDOM.dataset.gridIndex = placementIndex;

      panel.resize({ width: 365, height: 330 }).reposition(positionFn(positionedPanels));
      positionedPanels.push(panel);
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

console.log('=- Oi -----------------------------', new Date().toISOString().split('T')[1]);
