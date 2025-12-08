export function iterate<T extends HTMLElement = HTMLDivElement>(nodes: NodeList, selector: string, fn?: (e: T, key: number) => void) {
  let found = false;

  for (const node of nodes) {
    if (!(node instanceof HTMLElement)) continue;

    const panels = node.matches(selector) ? [node as T] : node.querySelectorAll<T>(selector);
    if (!panels.length) continue;
    if (fn) panels.forEach(fn);
    found = true;
  }

  return found;
}

export function observeIt<T extends HTMLElement = HTMLDivElement>({
  target,
  selector,
  forEachAddedNode,
  forEachRemovedNode,
  cleanup,
}: {
  target: Node;
  selector: string;
  forEachAddedNode?: (e: T, key: number) => void;
  forEachRemovedNode?: (e: T, key: number) => void;
  cleanup?: (result: { nodesAdded: boolean; nodesRemoved: boolean }) => void;
}) {
  // Observe DOM for dynamic panels
  const observerPanels = new MutationObserver((mutations) => {
    let nodesAdded = false;
    let nodesRemoved = false;

    for (const mutation of mutations) {
      if (iterate<T>(mutation.addedNodes, selector, forEachAddedNode)) nodesAdded = true;
      if (iterate<T>(mutation.removedNodes, selector, forEachRemovedNode)) nodesRemoved = true;
    }

    cleanup?.({ nodesAdded, nodesRemoved });
  });

  observerPanels.observe(target, { childList: true, subtree: false });

  return {
    teardown: () => {
      observerPanels.disconnect();
    },
  };
}
