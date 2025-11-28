export function waitToBe(
selector: string,
attributeFilter: string[] = ['aria-hidden'],
predicate: (arg0: HTMLElement) => boolean = el => el.getAttribute('aria-hidden') !== 'false'
) {
  return new Promise(resolve => {
    let attrObserver: MutationObserver | null = null;
    let domObserver: MutationObserver | null = null;

    function cleanup() {
      if (attrObserver) { attrObserver.disconnect(); attrObserver = null; }
      if (domObserver) { domObserver.disconnect(); domObserver = null; }
    }

    function attachAttrObserver(el) {
      if (!el) return false;
      if (predicate(el)) {
        cleanup();
        resolve(el);
        return true;
      }
      // Watch for attribute changes
      attrObserver = new MutationObserver(muts => {
        for (const m of muts) {
          if (m.type === 'attributes' && m.attributeName && attributeFilter.includes(m.attributeName)) {
            if (predicate(el)) {
              cleanup();
              resolve(el);
              return;
            }
          }
        }
      });
      attrObserver.observe(el, { attributes: true, attributeFilter });
      return false;
    }

    // If element already exists, attach attribute observer
    const existing = document.querySelector(selector);
    if (attachAttrObserver(existing)) return;

    // Otherwise watch for element being added to the DOM
    domObserver = new MutationObserver(muts => {
      for (const m of muts) {
        for (const node of m.addedNodes) {
          if (!(node instanceof HTMLElement)) continue;
          const found = node.matches(selector) ? node : node.querySelector(selector);
          if (!found) continue;
          if (attachAttrObserver(found)) {
            if (domObserver) { domObserver.disconnect(); domObserver = null; }
            return;
          }
        }
      }
    });

    domObserver.observe(document.body, { childList: true, subtree: true });
  });
}
