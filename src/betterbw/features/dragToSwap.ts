import { PANEL_SELECTOR, queryPanels } from '../utils/openPanel';
import { organizePanels, placeInSlot } from '../utils/organizePanels';
import dragToSwapCss from '../styles/dragToSwap.css?raw';

const HOVER_TOLERANCE_PX = 20; // How close the dragged cam must get to another cam's spot
const RELEASE_TOLERANCE_PX = 24; // How close to that spot it must be dropped to take it
const HIGHLIGHT_AFTER_MS = 250;
const SWAP_AFTER_MS = 1000;
const DRAG_THRESHOLD_PX = 3;

type Drag = {
  panel: HTMLDivElement;
  index: string;
  origin: DOMRect;
  /** Where every other cam sat when the drag started */
  slots: Map<HTMLDivElement, DOMRect>;
  moved: boolean;
  hovered: HTMLDivElement | null;
  timers: ReturnType<typeof setTimeout>[];
  highlights: HTMLElement[];
  /** The other cam, already moved to the dragged cam's spot, until the drop (or until dragged away from its spot) */
  pending: { target: HTMLDivElement; index: string; slot: DOMRect } | null;
  frame: number;
};

let drag: Drag | null = null;

const distance = (a: DOMRect, b: DOMRect) => Math.hypot(a.left - b.left, a.top - b.top);

function highlight(rect: DOMRect) {
  const el = document.createElement('div');
  el.className = 'bbw-swap-highlight';
  Object.assign(el.style, { left: `${rect.left}px`, top: `${rect.top}px`, width: `${rect.width}px`, height: `${rect.height}px` });
  document.body.appendChild(el);
  return el;
}

function stopHover(d: Drag) {
  d.timers.forEach(clearTimeout);
  d.timers = [];
  d.highlights.forEach((el) => el.remove());
  d.highlights = [];
  d.hovered = null;
}

function startHover(d: Drag, target: HTMLDivElement) {
  const slot = d.slots.get(target)!;
  d.hovered = target;
  d.timers = [
    setTimeout(() => {
      // The cam behind the dragged one, and the empty spot it will move to
      d.highlights = [highlight(slot), highlight(d.origin)];
    }, HIGHLIGHT_AFTER_MS),
    setTimeout(() => {
      stopHover(d);
      d.pending = { target, index: target.dataset.gridIndex!, slot };
      placeInSlot(target, +d.index);
    }, SWAP_AFTER_MS),
  ];
}

function update() {
  const d = drag;
  if (!d) return;
  d.frame = 0;

  const rect = d.panel.getBoundingClientRect();
  if (!d.moved) {
    if (distance(rect, d.origin) < DRAG_THRESHOLD_PX) return;
    d.moved = true;
    d.panel.classList.add('bbw-dragging');
  }

  if (d.pending) {
    if (distance(rect, d.pending.slot) <= RELEASE_TOLERANCE_PX) return;
    placeInSlot(d.pending.target, +d.pending.index); // Dragged away: that cam goes back
    d.pending = null;
  }

  let hovered: HTMLDivElement | null = null;
  for (const [other, slot] of d.slots) {
    if (other.isConnected && distance(rect, slot) <= HOVER_TOLERANCE_PX) {
      hovered = other;
      break;
    }
  }
  if (hovered === d.hovered) return;

  stopHover(d);
  if (hovered) startHover(d, hovered);
}

function onPointerDown(event: PointerEvent) {
  if (event.button !== 0 || !(event.target instanceof Element)) return;
  if (!event.target.closest('.jsPanel-hdr') || event.target.closest('button, input, a, .jsPanel-btn, .userAvatar')) return;

  const panel = event.target.closest<HTMLDivElement>(PANEL_SELECTOR);
  const index = panel?.dataset.gridIndex;
  if (!panel || !index) return;

  const slots = new Map<HTMLDivElement, DOMRect>();
  for (const other of queryPanels()) {
    if (other !== panel && other.dataset.gridIndex) slots.set(other, other.getBoundingClientRect());
  }
  drag = {
    panel,
    index,
    origin: panel.getBoundingClientRect(),
    slots,
    moved: false,
    hovered: null,
    timers: [],
    highlights: [],
    pending: null,
    frame: 0,
  };
}

function onPointerMove() {
  // After the drag library moves the panel for this same event
  if (drag && !drag.frame) drag.frame = requestAnimationFrame(update);
}

function onPointerUp() {
  const d = drag;
  if (!d) return;
  drag = null;
  cancelAnimationFrame(d.frame);
  stopHover(d);
  if (!d.moved) return;

  // After the drag library is done with its own drop handling
  setTimeout(() => {
    d.panel.classList.remove('bbw-dragging');
    const { pending } = d;
    if (!pending) return;

    if (distance(d.panel.getBoundingClientRect(), pending.slot) <= RELEASE_TOLERANCE_PX) {
      d.panel.dataset.gridIndex = pending.index;
      pending.target.dataset.gridIndex = d.index;
      organizePanels();
    } else {
      placeInSlot(pending.target, +pending.index);
    }
  });
}

/**
 * Dragging a cam over another one's spot, and holding it there for a second, swaps them: the other cam moves to
 * the dragged cam's spot, and the dragged cam takes its place when dropped near it. Works with any grid layout.
 */
export function setupDragToSwap() {
  GM.addStyle(dragToSwapCss);
  document.addEventListener('pointerdown', onPointerDown, true);
  document.addEventListener('pointermove', onPointerMove, { capture: true, passive: true });
  document.addEventListener('pointerup', onPointerUp, true);
  document.addEventListener('pointercancel', onPointerUp, true);
}
