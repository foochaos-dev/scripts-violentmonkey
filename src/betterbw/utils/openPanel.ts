import { isOnCooldown } from '../features/cooldown';
import { isDefined } from './filters';
import { organizePanels } from './organizePanels';
import { getUsername } from './scrappers';
import { topRandom } from './sortFunctions';

export const PANEL_SELECTOR = '.jsPanel.jsPanel-theme-default';
export const queryPanels = () => document.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR);
export const queryPanel = (target: HTMLElement | Document = document) => target.querySelector<HTMLDivElement>(PANEL_SELECTOR);

export type Candidate = Awaited<ReturnType<typeof getCandidates>>[number];

export function tryToOpenPanel(candidate: Candidate) {
  // console.log('Trying to open panel for', candidate.id);
  $('.webcamBtn', candidate.item).trigger('click');
}

export const getCandidates = async (compareFn = topRandom, _biases = {}) => {
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
  const values = Array.from(userItems.values());
  const promises = values.map(async (item) => {
    const username = item.dataset.username?.split('_')[0];
    if (!username) return;

    const status = await GM.getValue<string>(`${username}_status`);
    // skip users explicitly faded out
    if (status === '--') return;
    // skip users currently on cooldown
    if (await isOnCooldown(username)) return;

    return {
      item,
      username,
      status,
      bias: biases[status],
      onlineSince: parseInt(item.querySelector<HTMLDivElement>('.userLabel [data-date]')?.dataset.date || '0'),
    };
  });
  const entries = await Promise.all(promises).then((list) => list.filter(isDefined).sort(compareFn));

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
    const c = candidates.shift()!;
    if (openedIds.has(c.username)) continue;

    tryToOpenPanel(c);
    openedLength++;
  }

  organizePanels();
}
