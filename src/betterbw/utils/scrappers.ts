
// Utility
export function getRotation(element: HTMLElement) {
  if (!element || !element.dataset.rotation) return 0;
  return parseInt(element.dataset.rotation, 10) || 0;
}

export function getUsername(panel) {
  const title = panel.querySelector('.jsPanel-title');
  const username = title.childNodes.values().find(e => e.nodeType === 3 && e.nodeValue.trim()).nodeValue.trim();
  return username.split('_')[0];
}
