import { isDefined } from '../utils/filters';
import { queryPanels } from '../utils/openPanel';
import { getUsername } from '../utils/scrappers';

const STORAGE_KEY = 'stats.watchingMe';
const TICK_MS = 2000;
const SAVE_EVERY_MS = 15_000;
const MAIN_TAB_SELECTOR = '[data-label="Bateworld"]';

export type PeakKey = 'watchers' | 'onCam' | 'mutual' | 'roomShare' | 'camsShare';
export type Peak = { value: number; at: number };
type Peaks = Record<PeakKey, Peak>;

export type Snapshot = Record<PeakKey, number> & { names: string[] };

type Totals = {
  /** Time with at least one watcher */
  watchedMs: number;
  /** Sum of watchers × time; divided by `watchedMs`, it's the average number of watchers */
  watcherMs: number;
};

type Unsaved = Totals & { sessions: number; regulars: Record<string, number> };

export type SessionStats = Totals & { peaks: Peaks; watchers: Set<string> };

export type EverStats = Totals & {
  peaks: Peaks;
  /** Sessions (page loads) in which someone watched */
  sessions: number;
  /** Username → number of sessions they watched */
  regulars: Record<string, number>;
  /** When the tracking started */
  since: number;
};

const PEAK_KEYS: PeakKey[] = ['watchers', 'onCam', 'mutual', 'roomShare', 'camsShare'];

const emptyPeaks = () => Object.fromEntries(PEAK_KEYS.map((key) => [key, { value: 0, at: 0 }])) as Peaks;
const emptyUnsaved = (): Unsaved => ({ watchedMs: 0, watcherMs: 0, sessions: 0, regulars: {} });
const emptyEver = (): EverStats => ({ ...emptyUnsaved(), peaks: emptyPeaks(), since: Date.now() });

let now: Snapshot = { watchers: 0, onCam: 0, mutual: 0, roomShare: 0, camsShare: 0, names: [] };
const session: SessionStats = { watchedMs: 0, watcherMs: 0, peaks: emptyPeaks(), watchers: new Set() };
let ever = emptyEver();
// Increments are added to the stored values on save, so multiple tabs don't overwrite each other
let unsaved = emptyUnsaved();
let dirty = false;
let paused = false;
let lastTickAt = Date.now();
let savedAt = Date.now();

const listeners = new Set<() => void>();

export function subscribeWatchStats(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export const getWatchStats = () => ({ now, session, ever, paused });

export const isTransmitting = () => chatHTML5.myUser.webcam === true;

/** Other tabs (private chats, other rooms) don't reflect the main room, so they would skew the stats */
function isMainTabActive() {
  const tab = document.querySelector(MAIN_TAB_SELECTOR);
  if (!tab) return false;
  // Bootstrap marks either the tab itself or its <li>
  return tab.matches('.active, [aria-selected="true"]') || Boolean(tab.parentElement?.matches('li.active'));
}

const numberIn = (selector: string) => Number(document.querySelector(selector)?.textContent?.trim()) || 0;

function takeSnapshot(): Snapshot {
  const notMe = `:not([data-id="${chatHTML5.myUser.id}"])`;
  const watcherItems = Array.from(document.querySelectorAll<HTMLElement>(`#userList .userItem${notMe}:has(.eye-icon .isWatching)`));
  const names = [...new Set(watcherItems.map((item) => item.dataset.username?.split('_')[0]).filter(isDefined))];

  const watchers = Math.max(numberIn('#watchAtMe'), names.length);
  const onCam = watcherItems.filter((item) => item.dataset.webcam === 'true').length;
  const watching = new Set(Array.from(queryPanels(), getUsername));
  const mutual = names.filter((name) => watching.has(name)).length;

  const othersOnline = (numberIn('#onlineCounter') || document.querySelectorAll('#userList .userItem').length) - 1;
  const othersOnCam = document.querySelectorAll(`#userList .userItem${notMe}[data-webcam="true"]`).length;

  return {
    watchers,
    onCam,
    mutual,
    roomShare: othersOnline > 0 ? watchers / othersOnline : 0,
    camsShare: othersOnCam > 0 ? onCam / othersOnCam : 0,
    names,
  };
}

/** Takes a snapshot, and updates the peaks and the watchers with it */
function record(at: number) {
  now = takeSnapshot();

  if (now.watchers > 0 && session.peaks.watchers.value === 0) {
    ever.sessions++;
    unsaved.sessions++;
  }

  for (const key of PEAK_KEYS) {
    const value = now[key];
    if (value > session.peaks[key].value) session.peaks[key] = { value, at };
    if (value > ever.peaks[key].value) {
      ever.peaks[key] = { value, at };
      dirty = true;
    }
  }

  for (const name of now.names) {
    if (session.watchers.has(name)) continue;
    session.watchers.add(name);
    ever.regulars[name] = (ever.regulars[name] ?? 0) + 1;
    unsaved.regulars[name] = (unsaved.regulars[name] ?? 0) + 1;
  }
}

function tick() {
  const at = Date.now();

  // The previous snapshot lasted until now (unless it was taken on another tab)
  if (!paused && now.watchers > 0) {
    for (const totals of [session, ever, unsaved]) {
      totals.watchedMs += at - lastTickAt;
      totals.watcherMs += now.watchers * (at - lastTickAt);
    }
    dirty = true;
  }
  lastTickAt = at;

  paused = !isMainTabActive();
  if (!paused) record(at);

  if (dirty && at - savedAt > SAVE_EVERY_MS) save();

  listeners.forEach((listener) => listener());
}

async function load(): Promise<EverStats> {
  const stored = await GM.getValue<Partial<EverStats> | undefined>(STORAGE_KEY);
  const empty = emptyEver();
  return { ...empty, ...stored, peaks: { ...empty.peaks, ...stored?.peaks } };
}

function merge(base: EverStats, pending: Unsaved, peaks: Peaks): EverStats {
  const regulars = { ...base.regulars };
  for (const [name, count] of Object.entries(pending.regulars)) regulars[name] = (regulars[name] ?? 0) + count;

  return {
    since: base.since,
    peaks: Object.fromEntries(
      PEAK_KEYS.map((key) => [key, peaks[key].value > base.peaks[key].value ? peaks[key] : base.peaks[key]])
    ) as Peaks,
    watchedMs: base.watchedMs + pending.watchedMs,
    watcherMs: base.watcherMs + pending.watcherMs,
    sessions: base.sessions + pending.sessions,
    regulars,
  };
}

async function save() {
  dirty = false;
  savedAt = Date.now();
  const pending = unsaved;
  unsaved = emptyUnsaved();

  const saved = merge(await load(), pending, ever.peaks);
  await GM.setValue(STORAGE_KEY, saved);
  // Picks up other tabs' progress, keeping what was collected while saving
  ever = merge(saved, unsaved, ever.peaks);
}

export async function trackWatchStats() {
  ever = await load();
  lastTickAt = Date.now();
  tick();
  setInterval(tick, TICK_MS);

  // React right away to the counter changing, instead of waiting for the next tick
  const counter = document.getElementById('watchAtMe');
  if (counter) new MutationObserver(tick).observe(counter, { childList: true, characterData: true, subtree: true });

  window.addEventListener('pagehide', () => {
    if (dirty) save();
  });
}
