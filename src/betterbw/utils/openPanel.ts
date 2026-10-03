import { isOnCooldown, sessionCooldown } from '../features/cooldown';
import { isDefined } from './filters';
import { dataUsername } from './formatters';
import { organizePanels } from './organizePanels';
import { getUsername, getUserById } from './scrappers';
import { topRandom } from './sortFunctions';
import { getAlgo } from '../algo';

// Cams must not open automatically before the user has picked a chat room out of the room-selection modal
let roomSelected = false;
export const setRoomSelected = () => (roomSelected = true);

export const PANEL_SELECTOR = '.jsPanel.jsPanel-theme-default';
export const queryPanels = () => document.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR);
export const queryPanel = (target: HTMLElement | Document = document) => target.querySelector<HTMLDivElement>(PANEL_SELECTOR);

export type Candidate = Awaited<ReturnType<typeof getCandidates>>[number];

/**
 * Clicks a user's cam button on the script's behalf. When the chat doesn't open the cam (limit reached, cooldown...),
 * the click reaches the user's row and opens their menu, which the script never wants.
 */
export function clickWebcamButton(button: JQuery) {
  const menuWasOpen = $('#userMenu').is(':visible');
  button.trigger('click');
  if (!menuWasOpen) $('#userMenu').hide();
}

export function tryToOpenPanel(candidate: Candidate) {
  clickWebcamButton($('.webcamBtn', candidate.item));
}

const OPEN_TIMEOUT_MS = 6000;

const hasPanel = (username: string) => Array.from(queryPanels()).some((panel) => getUsername(panel) === username);

const hasRoomForAnotherCam = () => {
  const max = +chatHTML5.roles.user.webcamMax;
  return queryPanels().length < max && chatHTML5.getWebcamNumber() < max;
};

/** If a candidate's panel never actually opens (offline, private, kicked, ...), skip it for a while and try the next one instead */
function verifyOpened(candidate: Candidate, fallbacks: Candidate[]) {
  setTimeout(async () => {
    if (hasPanel(candidate.username)) return;

    const full_username = candidate.item.dataset.username;
    if (full_username) {
      sessionCooldown.add(full_username);
      setTimeout(() => sessionCooldown.delete(full_username), 30 * 60_000);
    }

    // Only in its place: not once the automatic opening is paused, or when the slot got filled meanwhile
    // (e.g. that cam was just slow to appear), which would go over the limit
    if (getAlgo() === '' || !hasRoomForAnotherCam()) return;

    // The fallbacks were picked when the batch opened: some may have been closed onto a cooldown since
    let next = fallbacks.shift();
    while (next && (hasPanel(next.username) || (await isOnCooldown(next.username)))) next = fallbacks.shift();
    if (!next || getAlgo() === '' || !hasRoomForAnotherCam()) return;

    console.warn(`[BBW] Cam for ${candidate.username} didn't open; trying ${next.username} instead`);
    tryToOpenPanel(next);
    verifyOpened(next, fallbacks);
  }, OPEN_TIMEOUT_MS);
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
    const full_username = item.dataset.username;
    const username = full_username?.split('_')[0];
    if (!username) return;
    // recently requested kicked out bug
    if (sessionCooldown.has(full_username)) return;

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
      onlineSince: (item.dataset.id && getUserById(item.dataset.id)?.obj.date) || 0,
    };
  });
  const entries = await Promise.all(promises).then((list) => list.filter(isDefined).sort(compareFn));

  return entries;
};

export function openCandidates(candidates: Candidate[]) {
  if (!roomSelected) return;

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
    verifyOpened(c, candidates);
    openedLength++;
  }

  organizePanels();
}
