import { PANEL_SELECTOR, queryPanels } from '../utils/openPanel';
import { getUserId } from '../utils/scrappers';

function closeCam(panel: HTMLDivElement) {
  const id = getUserId(panel);
  // Also stops the stream and tells the server, unlike just removing the panel
  if (id) chatHTML5.removeWebcam(id, 'bbw-before-room');
  else panel.remove();
}

/** The chat opens a cam on its own while the room-selection modal is still up; closes it before it's painted */
export function closeCamsUntil(roomSelected: Promise<unknown>) {
  queryPanels().forEach(closeCam);

  const observer = new MutationObserver((mutations) => {
    for (const { addedNodes } of mutations)
      for (const node of addedNodes)
        if (node instanceof HTMLDivElement && node.matches(PANEL_SELECTOR)) closeCam(node);
  });
  observer.observe(document.body, { childList: true, subtree: true });
  roomSelected.then(() => observer.disconnect());
}
