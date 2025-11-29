import { updateCssForOpenedPanels } from '../dynamicOpenedStyle';
import { PANEL_SELECTOR } from '../utils/openPanel';
import { getAlgo } from '../algo';
import { attachPanelActions, cleanupPanel } from './panelActions';
import { organizePanels } from '../utils/organizePanels';

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

let nextUser: HTMLDivElement | null = null;
export const setNextCam = (val: HTMLDivElement) => (nextUser = val);

export function observePanels(selector = PANEL_SELECTOR) {
  // Observe DOM for dynamic panels
  const observerPanels = new MutationObserver((mutations) => {
    let nodesAdded = false;
    let nodesRemoved = false;

    for (const mutation of mutations) {
      if (iterate(mutation.addedNodes, selector, attachPanelActions)) nodesAdded = true;
      if (iterate(mutation.removedNodes, selector, cleanupPanel)) nodesRemoved = true;
    }

    if (nodesAdded || nodesRemoved) organizePanels();

    if (nodesRemoved) {
      if (nextUser) {
        nextUser.querySelector<HTMLDivElement>('.webcamBtn.visible')?.click();
        nextUser = null;
      } else {
        const algo = getAlgo();
        if (algo) {
          setTimeout(() => {
            document.querySelector<HTMLButtonElement>(`button[data-sort-order="${algo}"]`)?.click();
          }, 32);
        }
      }
    }

    if (nodesAdded || nodesRemoved) updateCssForOpenedPanels();
  });

  observerPanels.observe(document.body, { childList: true, subtree: false });

  return { teardown: () => {} };
}
