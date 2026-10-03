import type { JSPanel } from '../types/JSPanel';

// Mirrors the GM-stored expiry, but readable synchronously: closing a panel re-triggers the auto-open algorithm
// right away (before GM.setValue's write round-trips), so without this the just-cooled-down user could get
// reopened by that same refill
const localCooldowns = new Map<string, number>();

// Cooldown helpers: store expiry timestamps (ms since epoch) using GM_setValue
export function cooldownIt({
  username,
  minutes = 15,
  panel,
}: {
  username: string | undefined;
  minutes?: number;
  panel?: Pick<JSPanel, 'id'> | null | undefined;
}) {
  if (!username) return;
  const expiry = Date.now() + minutes * 60 * 1000;
  localCooldowns.set(username, expiry);
  GM.setValue(`${username}_cooldown`, expiry);
  console.log(`User ${username} put on cooldown until`, new Date(expiry).toISOString());

  if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}

export async function isOnCooldown(id: string) {
  const local = localCooldowns.get(id);
  if (local !== undefined) {
    if (Date.now() < local) return true;
    localCooldowns.delete(id); // Expired
  }

  const val = await GM.getValue(`${id}_cooldown`);
  if (!val) return null;
  if (Date.now() < Number(val)) return true;

  GM.deleteValue(`${id}_cooldown`); // Expired
  return false;
}

/** Deletes expired cooldowns of users that never came back, so the storage doesn't grow forever */
export async function sweepExpiredCooldowns() {
  const keys = (await GM.listValues()).filter((key) => key.endsWith('_cooldown'));
  const now = Date.now();
  for (const key of keys) {
    if (now >= Number(await GM.getValue(key))) await GM.deleteValue(key);
  }
}

export const sessionCooldown = new Set<string>();
