import { isOnCooldown } from '../features/cooldown';
import { organizePanels } from './organizePanels';
import { getUsername } from './scrappers';
import { topRandom } from './sortFunctions';

export const PANEL_SELECTOR = '.jsPanel.jsPanel-theme-default';
export const queryPanels = () => document.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR);
export const queryPanel = (target: HTMLElement | Document) => target.querySelector<HTMLDivElement>(PANEL_SELECTOR);

type Candidate = { item: HTMLDivElement; id: string; status: string; bias: number; onlineSince: number };

export function tryToOpenPanel(candidate: Candidate) {
  // console.log('Trying to open panel for', candidate.id);
  $('.webcamBtn', candidate.item).trigger('click');
}

export const getCandidates = (compareFn = topRandom, _biases = {}) => {
  const biases = {
    // "--": 0,
    '-': 1,
    undefined: 2,
    '+': 3,
    '++': 4,
    ..._biases,
  };
  const userItems = document.querySelectorAll<HTMLDivElement>(
    '#userList [data-status="online"][data-webcam="true"]:not(:has(:is(.fa.fa-lock, .fa.fa-eye-slash)))'
  );
  const entries: any[] = [];
  for (const item of userItems.values()) {
    const id = item.dataset.username?.split('_')[0];
    if (!id) continue;
    const status = GM_getValue<string>(`${id}_status`);
    // skip users explicitly faded out
    if (status === '--') continue;
    // skip users currently on cooldown
    if (isOnCooldown(id)) continue;

    entries.push({
      item,
      id,
      status,
      bias: biases[status],
      onlineSince: parseInt(item.querySelector<HTMLDivElement>('.userLabel [data-date]')?.dataset.date || '0'),
    });
  }

  entries.sort(compareFn);

  return entries;
};

export function openCandidates(candidates: Candidate[]) {
  const opened = queryPanels();
  let openedLength = opened.length || 0;
  const maxToOpen = +chatHTML5.roles.user.webcamMax;
  if (openedLength >= maxToOpen) {
    organizePanels();
    return console.log(`Max number of panels (${maxToOpen}) already open`);
  }

  const openedIds = new Set(Array.from(opened).map((panel) => getUsername(panel)));
  while (openedLength < maxToOpen && candidates.length > 0) {
    const candidate = candidates.shift()!;
    if (openedIds.has(candidate.id)) continue;

    tryToOpenPanel(candidate);
    openedLength++;
  }

  organizePanels();
}
