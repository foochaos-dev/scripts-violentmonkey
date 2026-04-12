import type { JSPanel } from '../types/JSPanel';

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
  GM.setValue(`${username}_cooldown`, expiry);
  console.log(`User ${username} put on cooldown until`, new Date(expiry).toISOString());

  if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}

export async function isOnCooldown(id: string) {
  const val = await GM.getValue(`${id}_cooldown`);
  if (!val) return null;
  return Date.now() < Number(val);
}

export const sessionCooldown = new Set<string>();
