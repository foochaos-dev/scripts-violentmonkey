import type { StringNumber } from '../types/utils';
import { queryPanels } from '../utils/openPanel';
import { getUserId } from '../utils/scrappers';

/**
 * The chat only stops a cam's stream (and tells the server we stopped watching) when its close button is clicked.
 * Panels closed any other way (this script's ⏱, --, swaps and timeouts, or jsPanel.close()) kept the stream going,
 * and a cam that finished connecting after its panel was gone could even play in the background.
 */

/** Cams the chat itself just stopped, so they aren't stopped twice */
const recentlyStopped = new Set<string>();

function markStopped(id: string) {
  recentlyStopped.add(id);
  setTimeout(() => recentlyStopped.delete(id), 2000);
}

function detach(media: HTMLMediaElement) {
  media.pause();
  media.srcObject = null;
}

/** `removeWebcam` also removes the user's panel: never call it for a user who (still, or again) has one open */
const hasPanel = (id: string) => Array.from(queryPanels()).some((panel) => getUserId(panel) === id);

function stopWatching(id: string, why: string) {
  if (recentlyStopped.has(id)) return;

  chatHTML5.socket.emit('watch', chatHTML5.myUser.id, id, false);
  try {
    // Stops the stream; it skips the panel part, as the panel is already gone
    chatHTML5.removeWebcam(id, 'bbw-cleanup');
  } catch (error) {
    console.warn('[BBW] Could not stop the stream of', id, error);
  }
  console.info(`[BBW] Stopped the stream of ${chatHTML5.users[id as StringNumber]?.username ?? id} (${why})`);
}

/** The user id of a cam's media element: `video_<userid>` or `remotevideo<streamid>` */
function getMediaUserId(media: HTMLMediaElement) {
  const [, prefix, id] = media.id.match(/^(video_|remotevideo)(\d+)$/) ?? [];
  if (!id || prefix === 'video_') return id;
  const user = Object.values(chatHTML5.users).find((user) => String(user.streamid ?? user.id) === id);
  return user ? String(user.id) : id;
}

export function setupCamCleanup() {
  const { removeWebcam } = chatHTML5;
  chatHTML5.removeWebcam = (id, reason) => {
    markStopped(String(id));
    return removeWebcam(id, reason);
  };

  // A cam whose panel is already gone must never start playing
  const play = HTMLMediaElement.prototype.play;
  HTMLMediaElement.prototype.play = function (this: HTMLMediaElement) {
    if (this.isConnected || !this.srcObject) return play.call(this);

    const id = getMediaUserId(this);
    // The chat may set up a new video before putting it in the panel: that cam is still wanted
    if (id && hasPanel(id)) return play.call(this);

    detach(this);
    if (id) stopWatching(id, 'it connected after its panel closed');
    return Promise.resolve();
  };
}

/** For every cam panel removed from the page, however it was closed */
export function cleanupClosedCam(panel: HTMLDivElement) {
  panel.querySelectorAll<HTMLMediaElement>('video, audio').forEach(detach);

  const id = getUserId(panel);
  // The chat sometimes replaces a user's panel with a new one, which must keep its stream
  if (id && !hasPanel(id)) stopWatching(id, 'its panel closed');
}
