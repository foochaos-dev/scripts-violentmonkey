import { render, type ComponentChildren } from 'preact';
import { useLayoutEffect, useState } from 'preact/hooks';
import videoControlsCss from '../styles/videoControls.css?raw';
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

const Icon = ({ name }: { name: string }) => <i class={`fa fa-${name}`} />;

/** `stopPropagation`: a click on the controls must not reach the video, nor the panel behind it */
const Button = ({
  title,
  onClick,
  disabled,
  children,
}: {
  title: string;
  onClick: () => void;
  disabled?: boolean;
  children: ComponentChildren;
}) => (
  <button
    type="button"
    title={title}
    disabled={disabled}
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
  >
    {children}
  </button>
);

const toggleFullscreen = (container: HTMLElement) =>
  document.fullscreenElement === container ? document.exitFullscreen() : container.requestFullscreen();

const VIDEO_EVENTS = ['play', 'pause', 'volumechange'];

/**
 * Re-renders the bar on everything it reflects, so it always shows the video's current state.
 * Subscribes on layout, not on paint, so nothing that happens between the mount and the first frame is missed.
 * Nothing is torn down: the controls live as long as the cam's panel, and `onChange` has no counterpart.
 */
function useVideoState(video: HTMLVideoElement, container: HTMLElement, zoom: ZoomControls) {
  const [, setVersion] = useState(0);

  useLayoutEffect(() => {
    const rerender = () => setVersion((version) => version + 1);
    for (const type of VIDEO_EVENTS) video.addEventListener(type, rerender);
    container.addEventListener('fullscreenchange', rerender);
    zoom.onChange(rerender);
  }, []);
}

/** Same layout as the native controls: play on the left, volume and full screen on the right */
function Controls({
  video,
  container,
  zoom,
  onRotate,
}: {
  video: HTMLVideoElement;
  container: HTMLElement;
  zoom: ZoomControls;
  onRotate: () => void;
}) {
  useVideoState(video, container, zoom);

  return (
    <>
      <Button title="Play / pause" onClick={() => (video.paused ? video.play() : video.pause())}>
        <Icon name={video.paused ? 'play' : 'pause'} />
      </Button>
      <span class="bbw-spacer" />
      <Button
        title="Mute"
        onClick={() => {
          video.muted = !video.muted;
        }}
      >
        <Icon name={video.muted || video.volume === 0 ? 'volume-off' : 'volume-up'} />
      </Button>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        title={'Volume\nScroll over the controls to adjust it'}
        value={String(video.muted ? 0 : toPosition(video.volume))}
        onInput={(event) => {
          video.muted = false;
          video.volume = toVolume(Number(event.currentTarget.value));
        }}
      />
      <Button title={'Full screen\nor double-click the cam'} onClick={() => toggleFullscreen(container)}>
        <Icon name={document.fullscreenElement === container ? 'compress' : 'expand'} />
      </Button>
      {/* Hugs the right edge, above the bar; rotate sits to the left of the `+` and `-` it aligns with */}
      <div class="bbw-floating-controls">
        <div class="bbw-rotate">
          <Button title="Rotate" onClick={onRotate}>
            ⟳
          </Button>
        </div>
        <div class="bbw-zoom-controls">
          <Button title="Zoom in" onClick={zoom.zoomIn} disabled={!zoom.canZoomIn()}>
            <Icon name="plus" />
          </Button>
          <Button title="Zoom out" onClick={zoom.zoomOut} disabled={!zoom.isZoomed()}>
            <Icon name="minus" />
          </Button>
        </div>
      </div>
    </>
  );
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
  container.appendChild(bar);
  render(<Controls video={video} container={container} zoom={zoom} onRotate={onRotate} />, bar);

  // Like the native controls did
  video.addEventListener('dblclick', () => toggleFullscreen(container));

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
