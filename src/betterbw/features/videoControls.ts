import videoControlsCss from '../styles/videoControls.css?inline';
import { clamp } from '../utils/math';
import { upwardPx } from '../utils/wheel';
import { getSetting } from './settings';
import type { ZoomState } from './videoGestures';

// Volume follows `position ** CURVE`: tiny steps near 0%, slightly bigger (still fine) near 100%
const CURVE = 3;
const PX_PER_FULL_RANGE = 6000; // ~60 mouse-wheel notches from 0% to 100%
const EASING = 0.3; // Fraction of the remaining distance covered per frame; smooths out mouse-wheel notches

const HIDE_AFTER_MS = 2000;

const toPosition = (volume: number) => volume ** (1 / CURVE);
const toVolume = (position: number) => position ** CURVE;

let styleAdded = false;

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
    const upward = upwardPx(event);
    if (video.muted && upward > 0) video.muted = false;

    const idle = target === null;
    // Accumulate on the pending target, so fast scrolls aren't slowed down by the easing
    target = clamp(0, (target ?? toPosition(video.volume)) + upward / PX_PER_FULL_RANGE, 1);
    if (idle) requestAnimationFrame(step);
  };
}

function makeButton(title: string, onClick: () => void) {
  const button = document.createElement('button');
  button.type = 'button';
  button.title = title;
  button.addEventListener('click', (event) => {
    event.stopPropagation();
    onClick();
  });
  return button;
}

function setIcon(button: HTMLElement, name: string) {
  if (button.dataset.icon === name) return;
  button.dataset.icon = name;
  button.innerHTML = `<i class="fa fa-${name}"></i>`;
}

/** Shows the bar while the pointer moves over the cam, and hides it after a while (unless over the bar, or paused) */
function autoHide(container: HTMLElement, bar: HTMLElement, video: HTMLVideoElement) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  let overBar = false;

  const hide = () => {
    if (!overBar && !video.paused) bar.classList.remove('visible');
  };
  const show = () => {
    bar.classList.add('visible');
    clearTimeout(timer);
    timer = setTimeout(hide, HIDE_AFTER_MS);
  };

  container.addEventListener('pointermove', show);
  container.addEventListener('pointerleave', () => {
    clearTimeout(timer);
    overBar = false;
    hide();
  });
  bar.addEventListener('pointerenter', () => {
    overBar = true;
  });
  bar.addEventListener('pointerleave', () => {
    overBar = false;
    show();
  });
  video.addEventListener('play', show);
  video.addEventListener('pause', show);

  if (video.paused) bar.classList.add('visible');
}

export type ZoomControls = {
  zoomIn: () => void;
  zoomOut: () => void;
  isZoomed: () => boolean;
  canZoomIn: () => boolean;
  onChange: (listener: () => void) => void;
  getState: () => ZoomState;
};

/** `+` and `-`, stacked above the full screen button */
function makeZoomButtons(zoom: ZoomControls) {
  const zoomIn = makeButton('Zoom in', zoom.zoomIn);
  const zoomOut = makeButton('Zoom out', zoom.zoomOut);
  setIcon(zoomIn, 'plus');
  setIcon(zoomOut, 'minus');

  const sync = () => {
    zoomIn.disabled = !zoom.canZoomIn();
    zoomOut.disabled = !zoom.isZoomed();
  };
  zoom.onChange(sync);
  sync();

  const buttons = document.createElement('div');
  buttons.className = 'bbw-zoom-controls';
  buttons.append(zoomIn, zoomOut);
  return buttons;
}

/** To the left of the zoom controls, aligned with the bottom of that stack (the zoom out button) */
function makeRotateButton(onRotate: () => void) {
  const rotate = makeButton('Rotate', onRotate);
  rotate.textContent = '⟳';

  const group = document.createElement('div');
  group.className = 'bbw-rotate';
  group.append(rotate);
  return group;
}

/**
 * A compact controls bar, replacing the native one: Firefox's can't be restyled at all (Chrome's only partly),
 * both toggle play/pause on any click on the video, and they don't hide again once the pointer moves from them
 * to something over the video.
 * Scrolling over it adjusts the volume.
 */
export function attachVideoControls(video: HTMLVideoElement, zoom: ZoomControls, onRotate: () => void) {
  if (!styleAdded) {
    GM.addStyle(videoControlsCss);
    styleAdded = true;
  }

  video.controls = false;
  // In case the chat turns them back on
  new MutationObserver(() => {
    if (video.controls) video.controls = false;
  }).observe(video, { attributes: true, attributeFilter: ['controls'] });

  const container = video.parentElement!;
  if (getComputedStyle(container).position === 'static') container.style.position = 'relative';

  const bar = document.createElement('div');
  bar.className = 'bbw-controls';

  const play = makeButton('Play / pause', () => (video.paused ? video.play() : video.pause()));
  const mute = makeButton('Mute', () => {
    video.muted = !video.muted;
  });
  const volume = document.createElement('input');
  volume.type = 'range';
  volume.min = '0';
  volume.max = '1';
  volume.step = '0.01';
  volume.title = 'Volume\nScroll over the controls to adjust it';
  volume.addEventListener('input', () => {
    video.muted = false;
    video.volume = toVolume(Number(volume.value));
  });
  const spacer = document.createElement('span');
  spacer.className = 'bbw-spacer';
  const toggleFullscreen = () => (document.fullscreenElement === container ? document.exitFullscreen() : container.requestFullscreen());
  const fullscreen = makeButton('Full screen\nor double-click the cam', toggleFullscreen);
  // Like the native controls did
  video.addEventListener('dblclick', toggleFullscreen);

  const floating = document.createElement('div');
  floating.className = 'bbw-floating-controls';
  floating.append(makeRotateButton(onRotate), makeZoomButtons(zoom));

  // Same layout as the native controls: play on the left, volume and full screen on the right
  bar.append(play, spacer, mute, volume, fullscreen, floating);
  container.appendChild(bar);

  const sync = () => {
    setIcon(play, video.paused ? 'play' : 'pause');
    setIcon(mute, video.muted || video.volume === 0 ? 'volume-off' : 'volume-up');
    setIcon(fullscreen, document.fullscreenElement === container ? 'compress' : 'expand');
    volume.value = String(video.muted ? 0 : toPosition(video.volume));
  };
  for (const type of ['play', 'pause', 'volumechange']) video.addEventListener(type, sync);
  container.addEventListener('fullscreenchange', sync);
  sync();

  autoHide(container, bar, video);

  const onVolumeWheel = volumeOnScroll(video);
  bar.addEventListener(
    'wheel',
    (event) => {
      event.preventDefault();
      if (getSetting('scrollToVolume')) onVolumeWheel(event);
    },
    { passive: false }
  );
}
