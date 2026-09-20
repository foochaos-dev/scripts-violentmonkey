import { PANEL_SELECTOR, queryPanels } from '../utils/openPanel';
import { getSetting } from './settings';
import camsMoveAwayCss from '../styles/camsMoveAway.css?raw';

/** Breathing room between what the pointer went for and the cams that moved away from it */
const GAP_PX = 4;
/** Where the chat's tab strip ends, when it can't be measured (it's replaced by a dropdown on narrow screens) */
const FALLBACK_TABS_BOTTOM_PX = 65;

type Peek = {
  /** The cams that moved, and the custom property holding how far they did */
  panels: HTMLDivElement[];
  property: '--bbw-peek-x' | '--bbw-peek-y';
  /** The pointer has to leave this for the cams to come back; it covers their new spots, so they stay reachable */
  hold: DOMRect;
};

const rectOf = (left: number, top: number, right: number, bottom: number) => new DOMRect(left, top, right - left, bottom - top);
const contains = (rect: DOMRect, x: number, y: number) => x >= rect.left && x < rect.right && y >= rect.top && y < rect.bottom;
const overlaps = (a: DOMRect, b: DOMRect) => a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
const panelRects = () => Array.from(queryPanels(), (panel) => [panel, panel.getBoundingClientRect()] as const);

/** The chat's tab strip, and everything above it */
function tabsZone(): DOMRect | null {
  const chat = document.getElementById('tabsAndFooter')?.getBoundingClientRect();
  if (!chat?.width) return null;
  const tabs = document.querySelector('#tabs .nav-tabs:not(.nav-tabs-clone)')?.getBoundingClientRect();
  return rectOf(chat.left, 0, chat.right, tabs?.bottom || FALLBACK_TABS_BOTTOM_PX);
}

/** The buddy list, which the cams on its side of the window sit on top of */
function sidebarZone(): DOMRect | null {
  const sidebar = document.getElementById('usersContainer')?.getBoundingClientRect();
  return sidebar?.width ? sidebar : null;
}

/** On the cams that moved: lifts them over the ones they slid in front of (see camsMoveAway.css) */
const PEEKING_CLASS = 'bbw-peeking';

function startPanel(panel: HTMLDivElement, property: Peek['property'], shift: number) {
  panel.style.setProperty(property, `${shift}px`);
  panel.classList.add(PEEKING_CLASS);
}

/** Only the cams over the chat's tabs slide down; the rows below them stay where they are, and they slide on top */
function startTabsPeek(zone: DOMRect): Peek | null {
  const covering = panelRects().filter(([, rect]) => rect.left < zone.right && rect.right > zone.left && rect.top < zone.bottom);
  if (!covering.length) return null;

  const shift = Math.max(...covering.map(([, rect]) => zone.bottom - rect.top)) + GAP_PX;
  for (const [panel] of covering) startPanel(panel, '--bbw-peek-y', shift);

  const left = Math.min(zone.left, ...covering.map(([, rect]) => rect.left));
  const right = Math.max(zone.right, ...covering.map(([, rect]) => rect.right));
  return {
    panels: covering.map(([panel]) => panel),
    property: '--bbw-peek-y',
    hold: rectOf(left, zone.top, right, zone.bottom + shift),
  };
}

/** The cams over the buddy list slide sideways, towards the middle of the window */
function startSidebarPeek(zone: DOMRect): Peek | null {
  const covering = panelRects().filter(([, rect]) => overlaps(rect, zone));
  if (!covering.length) return null;

  // Whichever edge of the window the buddy list hugs, the cams leave on the other side
  const hugsRight = zone.left > innerWidth - zone.right;
  const needed = Math.max(...covering.map(([, rect]) => (hugsRight ? rect.right - zone.left : zone.right - rect.left)));
  const shift = (hugsRight ? -1 : 1) * (needed + GAP_PX);
  for (const [panel] of covering) startPanel(panel, '--bbw-peek-x', shift);

  const top = Math.min(zone.top, ...covering.map(([, rect]) => rect.top));
  const bottom = Math.max(zone.bottom, ...covering.map(([, rect]) => rect.bottom));
  return {
    panels: covering.map(([panel]) => panel),
    property: '--bbw-peek-x',
    hold: rectOf(Math.min(zone.left, zone.left + shift), top, Math.max(zone.right, zone.right + shift), bottom),
  };
}

function endPeek(peek: Peek | null, instant: boolean) {
  if (!peek) return null;

  for (const panel of peek.panels) {
    if (instant) panel.style.transition = 'none';
    panel.style.removeProperty(peek.property);
    panel.classList.remove(PEEKING_CLASS);
  }
  if (instant && peek.panels[0]) {
    // Commit the cams back on their spots before the transition is back on, so nothing animates from here
    void peek.panels[0].offsetHeight;
    for (const panel of peek.panels) panel.style.transition = '';
  }
  return null;
}

/** How long the pointer has to rest on the area, clear of every cam, before the cams in front of it move */
const DWELL_MS = 250;

type Side = {
  zone: () => DOMRect | null;
  start: (zone: DOMRect) => Peek | null;
  peek: Peek | null;
  /** Running while the pointer waits out the dwell on this side's area */
  timer: ReturnType<typeof setTimeout> | null;
};

const sides: Side[] = [
  { zone: tabsZone, start: startTabsPeek, peek: null, timer: null },
  { zone: sidebarZone, start: startSidebarPeek, peek: null, timer: null },
];

let enabled = true;
let pointerX = -1;
let pointerY = -1;
/** The cam under the pointer, if any: a cam never moves out from under the pointer, its own controls win */
let onPanel: HTMLDivElement | null = null;
let frame = 0;

function cancelDwell(side: Side) {
  if (side.timer) clearTimeout(side.timer);
  side.timer = null;
}

/** Brings every cam back where it belongs (instantly, when something is about to measure where they are) */
export function endPeeks(instant = false) {
  for (const side of sides) {
    cancelDwell(side);
    side.peek = endPeek(side.peek, instant);
  }
}

/** Once moved, cams stay out of the way while the pointer is on the area they freed, or on one of them */
const holds = (peek: Peek) => contains(peek.hold, pointerX, pointerY) || (!!onPanel && peek.panels.includes(onPanel));

/** The cams only move for a pointer resting on the area itself, clear of all of them */
const readyIn = (zone: DOMRect) => !onPanel && contains(zone, pointerX, pointerY);

function step(side: Side) {
  if (side.peek) {
    if (!holds(side.peek)) side.peek = endPeek(side.peek, false);
    return;
  }

  const zone = side.zone();
  if (!zone || !readyIn(zone)) return cancelDwell(side);
  if (side.timer) return; // Already waiting out the dwell; moving around the same area doesn't restart it

  side.timer = setTimeout(() => {
    side.timer = null;
    const zone = side.zone();
    if (zone && readyIn(zone)) side.peek = side.start(zone);
  }, DWELL_MS);
}

function update() {
  frame = 0;
  if (enabled) for (const side of sides) step(side);
}

function onMouseMove(event: MouseEvent) {
  // While a button is held (a cam being dragged, text being selected) the cams stay where they are
  if (event.buttons) return;
  pointerX = event.clientX;
  pointerY = event.clientY;
  onPanel = event.target instanceof Element ? event.target.closest<HTMLDivElement>(PANEL_SELECTOR) : null;
  if (!frame) frame = requestAnimationFrame(update);
}

/** The grab dragToSwap starts a drag on: the cam's title bar, clear of the controls on it */
const grabsPanel = (target: Element) => !!target.closest('.jsPanel-hdr') && !target.closest('button, input, a, .jsPanel-btn, .userAvatar');

function onPointerDown(event: PointerEvent) {
  for (const side of sides) cancelDwell(side);
  // Grabbing a cam that moved away drops it back on its spot first, so the drag starts from where the cam really is.
  // A click on one of its controls doesn't: the cam has to stay under the pointer for the click to land on it.
  if (event.button === 0 && event.target instanceof Element && grabsPanel(event.target)) endPeeks(true);
}

/** Re-reads the setting after it's toggled in the settings menu */
export function refreshCamsMoveAway() {
  enabled = getSetting('camsMoveAway');
  if (!enabled) endPeeks();
}

/**
 * The cams cover the chat's tabs and the buddy list. Rest the pointer on a free bit of either one, and the cams in
 * front of it slide out (down, off the tabs; sideways, off the buddy list) until the pointer leaves. Only those cams
 * move: the ones behind them stay put, and the ones that moved slide in front of them.
 *
 * A cam under the pointer stays put, both ways: cams never slide out from under a pointer that's on one of them,
 * and the ones that did move only come back once the pointer is off them, so their controls never slip away as
 * they're being aimed at.
 *
 * Only the offset is animated, with a CSS `translate` on the panels (see camsMoveAway.css), so the grid itself
 * never changes: every cam keeps the spot organizePanels gave it.
 */
export function setupCamsMoveAway() {
  GM.addStyle(camsMoveAwayCss);
  refreshCamsMoveAway();

  // Before dragToSwap's own listener, which measures where the cams are as soon as one is grabbed
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('mousemove', onMouseMove, { capture: true, passive: true });
  document.documentElement.addEventListener('mouseleave', () => endPeeks());
  addEventListener('blur', () => endPeeks());
  addEventListener('resize', () => endPeeks());
}
