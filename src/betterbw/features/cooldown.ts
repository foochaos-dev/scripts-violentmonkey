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
  setCooldown(username, expiry);
  console.log(`User ${username} put on cooldown until`, new Date(expiry).toISOString());

  if (panel) jsPanel.activePanels.getPanel(panel.id)?.close();
}

export function setCooldown(id: string, expiryMs: number) {
  GM_setValue(`${id}_cooldown`, expiryMs);
}

function getCooldownExpiry(id: string) {
  const val = GM_getValue(`${id}_cooldown`);
  return val ? Number(val) : null;
}

export function isOnCooldown(id: string) {
  const expiry = getCooldownExpiry(id);
  return expiry && Date.now() < expiry;
}
