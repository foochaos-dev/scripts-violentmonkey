/**
 * Return a boolean to tell if the tab is visible
 */
export const tabFocused = (): boolean => {
  return document.visibilityState === 'visible';
};

/**
 * Schedule a click when the tab is focused.
 * It might be called multiple times, but it should click only once.
 */
export const whenTabFocused = (callback: () => void) => {
  document.addEventListener(
    'visibilitychange',
    () => {
      tabFocused() && callback();
    },
    { once: true, passive: true }
  );
};
