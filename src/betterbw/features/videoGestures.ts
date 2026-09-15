import { clamp } from '../utils/math';
import { deltaPx, unitPx } from '../utils/wheel';
import { getSetting } from './settings';
import { attachVideoControls } from './videoControls';

const MAX_ZOOM = 4;
const ZOOM_STEP = 1.25; // Per click on the zoom buttons
const ZOOM_PX_PER_E = 100; // Pinch: matches Chrome's own pinch-to-zoom speed
const MAX_ZOOM_DELTA_PX = 25;
const DRAG_THRESHOLD_PX = 3;

// Chrome and Safari on macOS report mouse-wheel notches as (tiny) multiples of this
const MAC_WHEEL_NOTCH_PX = 4.000244140625;

/**
 * Ctrl + mouse wheel, rather than a trackpad pinch (which browsers also report as Ctrl + wheel events,
 * but as a stream of small, fractional deltas). Same heuristic as Mapbox's scroll zoom.
 */
function isWheelNotch(event: WheelEvent) {
  const delta = Math.abs(event.deltaY);
  return (
    event.deltaMode !== WheelEvent.DOM_DELTA_PIXEL // Firefox
    || delta % MAC_WHEEL_NOTCH_PX === 0 // Chrome and Safari on macOS
    || (Number.isInteger(delta) && delta >= 50) // Windows and Linux
  );
}

export type ZoomState = { scale: number; x: number; y: number };

/**
 * Zooms the video inside its panel, and lets it be moved around while zoomed.
 * Uses the `scale`/`translate` properties, so it composes with the `rotate` set by the rotation feature.
 */
function zoomAndPan(video: HTMLVideoElement, initial?: ZoomState) {
  let scale = initial?.scale ?? 1;
  let x = initial?.x ?? 0;
  let y = initial?.y ?? 0;
  let drag: { pointerId: number; startX: number; startY: number; fromX: number; fromY: number; moved: boolean } | null = null;
  const clip = video.closest<HTMLElement>('.jsPanel-content') ?? video.parentElement;
  const listeners = new Set<() => void>();

  const render = () => {
    const zoomed = scale > 1;
    video.style.scale = zoomed ? `${scale}` : '';
    video.style.translate = zoomed ? `${x}px ${y}px` : '';
    video.style.cursor = drag?.moved ? 'grabbing' : zoomed ? 'grab' : '';
    if (clip) clip.style.overflow = zoomed ? 'hidden' : '';
    listeners.forEach((listener) => listener());
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

  /** Zooms keeping still the point at (cx, cy), relative to the un-zoomed center (also the rotation center) */
  const zoomAt = (rect: DOMRect, cx: number, cy: number, factor: number) => {
    const next = clamp(1, scale * factor, MAX_ZOOM);
    moveTo(rect, cx - (next / scale) * (cx - x), cy - (next / scale) * (cy - y), next);
  };

  video.addEventListener('pointerdown', (event) => {
    if (scale === 1 || event.button !== 0) return;
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

  const endDrag = (event: PointerEvent) => {
    if (drag?.pointerId !== event.pointerId) return;
    drag = null;
    render();
  };
  video.addEventListener('pointerup', endDrag);
  video.addEventListener('pointercancel', endDrag);

  /** Towards the fingers */
  const onPinchWheel = (event: WheelEvent) => {
    const rect = video.getBoundingClientRect(); // Includes the current zoom
    const cx = event.clientX - (rect.left + rect.width / 2 - x);
    const cy = event.clientY - (rect.top + rect.height / 2 - y);
    zoomAt(rect, cx, cy, Math.exp(-clamp(-MAX_ZOOM_DELTA_PX, deltaPx(event), MAX_ZOOM_DELTA_PX) / ZOOM_PX_PER_E));
  };

  /** Like scrolling a zoomed-in webpage: moves the view around, the same direction as the fingers/wheel */
  const onPanWheel = (event: WheelEvent) => {
    moveTo(video.getBoundingClientRect(), x - event.deltaX * unitPx(event.deltaMode), y - deltaPx(event));
  };

  if (scale > 1) render(); // Apply the restored zoom right away

  return {
    onPinchWheel,
    onPanWheel,
    // The buttons zoom around the middle of what's visible
    zoomIn: () => zoomAt(video.getBoundingClientRect(), 0, 0, ZOOM_STEP),
    zoomOut: () => zoomAt(video.getBoundingClientRect(), 0, 0, 1 / ZOOM_STEP),
    isZoomed: () => scale > 1,
    canZoomIn: () => scale < MAX_ZOOM,
    onChange: (listener: () => void) => listeners.add(listener),
    getState: (): ZoomState => ({ scale, x, y }),
  };
}

/**
 * Over the video:
 * - pinch zooms into it, instead of zooming the page (so do the zoom buttons on its controls)
 * - once zoomed, drag or scroll to move around, like on a webpage zoomed in on a Mac
 * - clicking does nothing (the native controls, which toggled play/pause, are replaced - see videoControls.ts)
 * Scrolling over its controls bar adjusts the volume.
 */
export function attachVideoGestures(video: HTMLVideoElement, onRotate: () => void, initial?: ZoomState) {
  const zoom = zoomAndPan(video, initial);
  attachVideoControls(video, zoom, onRotate);

  video.addEventListener(
    'wheel',
    (event) => {
      // Browsers report a trackpad pinch as Ctrl + wheel events; an actual Ctrl + mouse wheel zooms the page, as usual
      if (event.ctrlKey && isWheelNotch(event)) return;
      event.preventDefault(); // Otherwise, never let it scroll or zoom the page while over a cam

      if (event.ctrlKey) {
        if (getSetting('pinchToZoom')) zoom.onPinchWheel(event);
      } else if (zoom.isZoomed()) {
        zoom.onPanWheel(event);
      }
    },
    { passive: false }
  );

  return zoom;
}
