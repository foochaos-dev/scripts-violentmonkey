import type { StringNumber } from '../types/utils';
import type { PreferredAlgo } from '../algo';
import type { LayoutName } from '../utils/organizePanels';

export type WatchNotifications = 'off' | 'plusplus' | 'liked' | 'all';

const DEFAULTS = {
  watchNotifications: 'off' as WatchNotifications,
  /** Volume newly opened cams start at (0-1), until changed for that buddy */
  defaultVolume: 0.08,
  scrollToVolume: true,
  pinchToZoom: true,
  preferredAlgo: 'top' as PreferredAlgo,
  /** The applied layout; its own options below apply right away, but switching layouts waits for "Apply layout" */
  layout: 'adaptable' as LayoutName,
  classicWidth: 365,
  adaptableRows: 3,
  /** Cams slide out of the way while the pointer is over the chat's tabs or the buddy list */
  camsMoveAway: true,
  /** Swaps open "-" cams for better candidates (by the running algorithm) whenever cams get (re)filled */
  upgradeMinus: true,
};
type Settings = typeof DEFAULTS;
export type BooleanSetting = { [K in keyof Settings]: Settings[K] extends boolean ? K : never }[keyof Settings];

export const getSetting = <K extends keyof Settings>(key: K): Settings[K] => GM_getValue(`settings.${key}`, DEFAULTS[key]);
export const setSetting = <K extends keyof Settings>(key: K, value: Settings[K]) => GM.setValue(`settings.${key}`, value);

export type SiteOption = { key: string; label: string; group: string; type?: 'number'; unit?: string };

/** The chat's own options (chatHTML5.config), that it doesn't let us change */
export const SITE_OPTIONS: SiteOption[] = [
  { group: 'Sidebar', key: 'displayConnectedSince', label: 'For how long buddies are online' },
  { group: 'Chat', key: 'groupMessages', label: 'Group messages in a row from the same buddy' },
  { group: 'Chat', key: 'showMessageServer', label: 'Enter, leave and kick notices' },
  { group: 'Chat', key: 'hideMessageServerAfterNseconds', label: 'Hide those notices after', type: 'number', unit: 's (0: never)' },
  { group: 'Cams', key: 'soundMutedAtStart', label: 'Start cams muted' },
];

/** Always forced off: this script opens cams itself, only once a room is selected (see betterbw.user.ts) */
const FORCED_SITE_OPTIONS: Record<string, StringNumber> = {
  openMostPopularCamAutomatically: '0',
};

const siteOptionKey = (key: string) => `settings.site.${key}`;

/** Only the options changed in the settings menu override the chat's defaults */
export function applySiteOptions() {
  Object.assign(chatHTML5.config, FORCED_SITE_OPTIONS);

  for (const { key } of SITE_OPTIONS) {
    const value = GM_getValue<string | null>(siteOptionKey(key), null);
    if (value !== null) chatHTML5.config[key] = value as StringNumber;
  }
}

export function setSiteOption(key: string, value: string) {
  chatHTML5.config[key] = value as StringNumber;
  GM.setValue(siteOptionKey(key), value);
}
