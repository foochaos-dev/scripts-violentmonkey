import { clamp } from '../utils/math';

// Volume follows `position ** CURVE`: tiny steps near 0%, slightly bigger (still fine) near 100%
const CURVE = 3;
const PX_PER_FULL_RANGE = 6000; // ~60 mouse-wheel notches from 0% to 100%
const EASING = 0.3; // Fraction of the remaining distance covered per frame; smooths out mouse-wheel notches

const MAX_ZOOM = 4;
const ZOOM_PX_PER_E = 100; // Matches Chrome's own pinch-to-zoom speed
const MAX_ZOOM_DELTA_PX = 25; // Ctrl + mouse-wheel notches are much bigger than pinch deltas
const DRAG_THRESHOLD_PX = 3;

const CONTROLS_BAR_PX = 48; // Height of the native controls bar, at the bottom of the video

const LINE_PX = 100 / 3; // Chrome scrolls 100px per wheel notch (3 lines)
const PAGE_PX = 800;

// macOS "natural scrolling" (on by default) flips deltaY relative to the fingers/wheel; only Safari tells us for sure
const IS_MAC = /Mac/.test(navigator.userAgent);

const toPosition = (volume: number) => volume ** (1 / CURVE);
const toVolume = (position: number) => position ** CURVE;

function deltaPx(event: WheelEvent) {
  const unit = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? LINE_PX : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? PAGE_PX : 1;
  return event.deltaY * unit;
}

/** Positive when the fingers/wheel move up, whatever the scrolling direction setting */
function upwardPx(event: WheelEvent & { webkitDirectionInvertedFromDevice?: boolean }) {
  const inverted = event.webkitDirectionInvertedFromDevice ?? IS_MAC;
  return inverted ? deltaPx(event) : -deltaPx(event);
}

/** Whether the pointer is over the native controls bar, taking the video's rotation and zoom into account */
function isOverControls(video: HTMLVideoElement, event: MouseEvent) {
  if (!video.controls) return false;

  const rect = video.getBoundingClientRect();
  const dx = event.clientX - (rect.left + rect.width / 2);
  const dy = event.clientY - (rect.top + rect.height / 2);
  const angle = ((parseFloat(getComputedStyle(video).rotate) || 0) * Math.PI) / 180;
  const scale = parseFloat(video.style.scale) || 1;

  // Undo the rotation and the zoom, back to the video's own coordinates (relative to its center)
  const localY = (-dx * Math.sin(angle) + dy * Math.cos(angle)) / scale;
  return localY > video.offsetHeight / 2 - CONTROLS_BAR_PX;
}

function volumeOnScroll(video: HTMLVideoElement) {
  let target: number | null = null; // Position being eased towards; null when idle

  const step = () => {
    if (target === null) return;

    const current = toPosition(video.volume);
    const next = current + (target - current) * EASING;
    const arrived = Math.abs(target - next) < 0.001;
    video.volume = toVolume(arrived ? target : next);

    if (arrived) target = null;
    else requestAnimationFrame(step);
  };

  return (event: WheelEvent) => {
    const idle = target === null;
    // Accumulate on the pending target, so fast scrolls aren't slowed down by the easing
    target = clamp(0, (target ?? toPosition(video.volume)) + upwardPx(event) / PX_PER_FULL_RANGE, 1);
    if (idle) requestAnimationFrame(step);
  };
}

/**
 * Zooms the video inside its panel, towards the cursor, and lets it be dragged around while zoomed.
 * Uses the `scale`/`translate` properties, so it composes with the `rotate` set by the rotation feature.
 */
function zoomAndPan(video: HTMLVideoElement) {
  let scale = 1;
  let x = 0;
  let y = 0;
  let drag: { pointerId: number; startX: number; startY: number; fromX: number; fromY: number; moved: boolean } | null = null;
  const clip = video.closest<HTMLElement>('.jsPanel-content') ?? video.parentElement;

  const render = () => {
    const zoomed = scale > 1;
    video.style.scale = zoomed ? `${scale}` : '';
    video.style.translate = zoomed ? `${x}px ${y}px` : '';
    video.style.cursor = drag?.moved ? 'grabbing' : zoomed ? 'grab' : '';
    if (clip) clip.style.overflow = zoomed ? 'hidden' : '';
  };

  /** Keeps the video covering its box, so the panel's background never shows */
  const moveTo = (rect: DOMRect, nextX: number, nextY: number, nextScale = scale) => {
    const maxX = ((nextScale - 1) * rect.width) / scale / 2;
    const maxY = ((nextScale - 1) * rect.height) / scale / 2;
    x = clamp(-maxX, nextX, maxX);
    y = clamp(-maxY, nextY, maxY);
    scale = nextScale;
    render();
  };

  video.addEventListener('dblclick', (event) => {
    if (scale === 1 || isOverControls(video, event)) return;
    event.preventDefault(); // Don't go fullscreen
    scale = 1;
    x = y = 0;
    render();
  });

  video.addEventListener('pointerdown', (event) => {
    if (scale === 1 || event.button !== 0 || isOverControls(video, event)) return;
    event.preventDefault(); // No text selection while dragging
    video.setPointerCapture(event.pointerId);
    drag = { pointerId: event.pointerId, startX: event.clientX, startY: event.clientY, fromX: x, fromY: y, moved: false };
  });

  video.addEventListener('pointermove', (event) => {
    if (drag?.pointerId !== event.pointerId) return;
    const dx = event.clientX - drag.startX;
    const dy = event.clientY - drag.startY;
    if (!drag.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD_PX) return;

    drag.moved = true;
    moveTo(video.getBoundingClientRect(), drag.fromX + dx, drag.fromY + dy);
  });

  let dragEndedAt = 0;
  const endDrag = (event: PointerEvent) => {
    if (drag?.pointerId !== event.pointerId) return;
    if (drag.moved) dragEndedAt = event.timeStamp;
    drag = null;
    render();
  };
  video.addEventListener('pointerup', endDrag);
  video.addEventListener('pointercancel', endDrag);

  /** Whether this click is just the end of a drag */
  const endsDrag = (event: MouseEvent) => event.timeStamp - dragEndedAt < 100;

  const onWheel = (event: WheelEvent) => {
    const rect = video.getBoundingClientRect(); // Includes the current zoom

    // Cursor, relative to the un-zoomed center (which is also the rotation center)
    const cx = event.clientX - (rect.left + rect.width / 2 - x);
    const cy = event.clientY - (rect.top + rect.height / 2 - y);

    const delta = clamp(-MAX_ZOOM_DELTA_PX, deltaPx(event), MAX_ZOOM_DELTA_PX);
    const next = clamp(1, scale * Math.exp(-delta / ZOOM_PX_PER_E), MAX_ZOOM);

    // Keep the point under the cursor still
    moveTo(rect, cx - (next / scale) * (cx - x), cy - (next / scale) * (cy - y), next);
  };

  return { onWheel, endsDrag };
}

/**
 * Over the video:
 * - scroll adjusts the volume
 * - pinch (or Ctrl + scroll) zooms the video instead of the page; drag it around while zoomed
 * - clicking no longer toggles play/pause, except on the controls bar
 */
export function attachVideoGestures(video: HTMLVideoElement) {
  const onVolumeWheel = volumeOnScroll(video);
  const zoom = zoomAndPan(video);

  video.addEventListener(
    'wheel',
    (event) => {
      // Also blocks the page zoom and the horizontal-swipe history navigation
      event.preventDefault();

      // Browsers report a trackpad pinch as a wheel event with ctrlKey
      if (event.ctrlKey) zoom.onWheel(event);
      else if (Math.abs(event.deltaY) >= Math.abs(event.deltaX)) onVolumeWheel(event);
    },
    { passive: false }
  );

  // The native controls toggle play/pause on any click on the video. Their buttons get the same event
  // (retargeted from the shadow DOM), so only the controls bar area is let through.
  video.addEventListener('click', (event) => {
    if (zoom.endsDrag(event) || !isOverControls(video, event)) event.preventDefault();
  });
}
