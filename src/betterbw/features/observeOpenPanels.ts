import { updateCssForOpenedPanels } from '../dynamicOpenedStyle';
import { PANEL_SELECTOR } from '../utils/openPanel';
import { getAlgo } from '../algo';
import { attachPanelActions, cleanupPanel } from '../panelActions';

export function iterate(nodes: NodeList, selector: string, fn: (e: HTMLDivElement, key: number) => void) {
  let found = false;

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;

    const panels = node.matches(selector) ? [node as HTMLDivElement] : node.querySelectorAll<HTMLDivElement>(selector);
    if (!panels.length) continue;
    panels.forEach(fn);
    found = true;
  }

  return found;
}

export function observePanels(selector = PANEL_SELECTOR) {
  // Observe DOM for dynamic panels
  const observerPanels = new MutationObserver((mutations) => {
    let nodesAdded = false;
    let nodesRemoved = false;

    for (const mutation of mutations) {
      if (iterate(mutation.addedNodes, selector, attachPanelActions)) nodesAdded = true;
      if (iterate(mutation.removedNodes, selector, cleanupPanel)) nodesRemoved = true;
    }

    if (nodesRemoved) {
      const algo = getAlgo();
      if (algo) {
        setTimeout(() => {
          document.querySelector<HTMLButtonElement>(`button[data-sort-order="${algo}"]`)?.click();
        }, 32);
      }
    }
    if (nodesRemoved || nodesAdded) updateCssForOpenedPanels();
  });

  observerPanels.observe(document.body, { childList: true, subtree: false });

  return { teardown: () => {} };
}
