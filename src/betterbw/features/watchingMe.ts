import type { User } from '../types/ChatHTML5';
import { escapeHtml } from '../utils/formatters';
import { queryPanels } from '../utils/openPanel';
import { getUserId } from '../utils/scrappers';
import { getSetting } from './settings';

/** Gold border on the cams of the buddies watching me (see .watchingMe in openPanels.css) */
export function markPanelsWatchingMe() {
  for (const panel of queryPanels()) {
    const id = getUserId(panel);
    panel.classList.toggle('watchingMe', Boolean(id && id in chatHTML5.watchingAtMe));
  }
}

async function notifyWatching(user: User) {
  const mode = getSetting('watchNotifications');
  if (mode === 'off') return;

  const username = user.username.split('_')[0]!;
  const status = await GM.getValue<string | undefined>(`${username}_status`);
  if (status === '--') return;
  if (mode === 'plusplus' && status !== '++') return;
  if (mode === 'liked' && status !== '+' && status !== '++') return;

  const label = `<span class="userLabelBBW" data-username="${escapeHtml(username)}">${escapeHtml(username)}</span>`;
  chatHTML5.serverMessageCurrentTab(`👁 ${label} started watching you`, 'bbw-watch-notice');
}

/** Reacts to the chat's own "watched" events, instead of scanning the sidebar */
export function setupWatchingMe() {
  const notified = new Set<string>();
  markPanelsWatchingMe();

  chatHTML5.socket.on('watched', (user: User, watching: boolean) => {
    markPanelsWatchingMe();

    const id = String(user.id);
    if (!watching) notified.delete(id);
    else if (id !== String(chatHTML5.myUser.id) && !notified.has(id)) {
      notified.add(id);
      notifyWatching(user);
    }
  });
}
