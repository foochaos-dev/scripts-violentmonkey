import type { JSPanel } from '../types';

// Cooldown helpers: store expiry timestamps (ms since epoch) using GM_setValue
export function cooldownIt({ id, minutes = 15, panel }: { id: string; minutes?: number; panel?: JSPanel | null }) {
  const expiry = Date.now() + minutes * 60 * 1000;
  setCooldown(id, expiry);
  console.log(`User ${id} put on cooldown until`, new Date(expiry).toISOString());

  if (!panel) return;
  jsPanel.activePanels.getPanel(panel.id)?.close();
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
