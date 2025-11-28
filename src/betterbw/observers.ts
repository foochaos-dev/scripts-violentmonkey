import { updateCssForOpenedPanels } from './dynamicOpenedStyle';
import { PANEL_SELECTOR } from './utils/openPanel';
import { getAlgo } from './algo';
import { attachPanelActions, cleanupPanel } from './panelActions';


// Observe DOM for dynamic panels
export const observerPanels = new MutationObserver(mutations => {
  let cleanupNeeded = false;

  for (const mutation of mutations) {
    // Handle added nodes
    for (const node of mutation.addedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const panels = node.matches(PANEL_SELECTOR)
        ? [node as HTMLDivElement]
        : node.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR);
      if (!panels.length) continue;
      panels.forEach(attachPanelActions);
      cleanupNeeded = true;
    }

    // Handle removed nodes
    for (const node of mutation.removedNodes) {
      if (!(node instanceof HTMLElement)) continue;
      const panels = node.matches(PANEL_SELECTOR)
        ? [node as HTMLDivElement]
        : node.querySelectorAll<HTMLDivElement>(PANEL_SELECTOR);
      if (!panels.length) continue;
      panels.forEach(cleanupPanel);
      cleanupNeeded = true;
      const algo = getAlgo();
      if (algo) {
        setTimeout(() => {
          document.querySelector<HTMLButtonElement>(`button[data-sort-order="${algo}"]`)?.click();
        }, 32);
      }
    }
  }

  if (cleanupNeeded) updateCssForOpenedPanels();
});

observerPanels.observe(document.body, { childList: true, subtree: false,  });
