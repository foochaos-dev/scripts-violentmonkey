const LINE_PX = 100 / 3; // Chrome scrolls 100px per wheel notch (3 lines)
const PAGE_PX = 800;

// macOS "natural scrolling" (on by default) flips deltaY relative to the fingers/wheel; only Safari tells us for sure
const IS_MAC = /Mac/.test(navigator.userAgent);

/** Pixels per unit of a wheel event's delta */
export function unitPx(mode: number) {
  return mode === WheelEvent.DOM_DELTA_LINE ? LINE_PX : mode === WheelEvent.DOM_DELTA_PAGE ? PAGE_PX : 1;
}

export function deltaPx(event: WheelEvent) {
  return event.deltaY * unitPx(event.deltaMode);
}

/** Positive when the fingers/wheel move up, whatever the scrolling direction setting */
export function upwardPx(event: WheelEvent & { webkitDirectionInvertedFromDevice?: boolean }) {
  const inverted = event.webkitDirectionInvertedFromDevice ?? IS_MAC;
  return inverted ? deltaPx(event) : -deltaPx(event);
}
