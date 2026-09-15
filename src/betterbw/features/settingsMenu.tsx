import type { InputHTMLAttributes } from 'preact';
import { useEffect, useRef, useState } from 'preact/hooks';
import {
  getSetting,
  setSetting,
  setSiteOption,
  SITE_OPTIONS,
  type BooleanSetting,
  type SiteOption,
  type WatchNotifications,
} from './settings';
import { ALGO_DESCRIPTIONS, clickOnCurrentAlgoButton, runAlgo } from './globalActions';
import { getAlgo, type PreferredAlgo } from '../algo';
import { gridconf, LAYOUT_LABELS, MAX_ROWS, organizePanels, panelRatio, type LayoutName } from '../utils/organizePanels';
import { refreshCamsMoveAway } from './camsMoveAway';

const PANEL_WIDTH = 640;

const NOTIFICATIONS: [WatchNotifications, string][] = [
  ['off', 'Off'],
  ['plusplus', 'Only ++'],
  ['liked', 'Buddies you liked (+, ++)'],
  ['all', 'Everyone (except --)'],
];

const GROUPS = [...new Set(SITE_OPTIONS.map((option) => option.group))];
const START_MUTED_OPTION = SITE_OPTIONS.find((option) => option.key === 'soundMutedAtStart')!;

function SiteOptionInput({ option, onChange }: { option: SiteOption; onChange: () => void }) {
  const value = String(chatHTML5.config[option.key] ?? '');

  if (option.type === 'number') {
    return (
      <label>
        {option.label}
        <input
          type="number"
          min="0"
          value={value || '0'}
          onChange={(e) => {
            setSiteOption(option.key, String(Math.max(0, parseInt(e.currentTarget.value) || 0)));
            onChange();
          }}
        />
        {option.unit}
      </label>
    );
  }

  return (
    <label>
      <input
        type="checkbox"
        checked={value === '1'}
        onChange={(e) => {
          setSiteOption(option.key, e.currentTarget.checked ? '1' : '0');
          onChange();
        }}
      />
      {option.label}
    </label>
  );
}

function VolumePercentInput() {
  const [percent, setPercent] = useState(() => Math.round(getSetting('defaultVolume') * 100));
  return (
    <label>
      Default volume for new cams
      <input
        type="number"
        min="0"
        max="100"
        value={percent}
        onChange={(e) => {
          const value = Math.min(100, Math.max(0, parseInt(e.currentTarget.value) || 0));
          setPercent(value);
          setSetting('defaultVolume', value / 100);
        }}
      />
      %
    </label>
  );
}

function ToggleSetting({
  setting,
  label,
  explain,
  onChange,
}: {
  setting: BooleanSetting;
  label: string;
  explain?: string;
  onChange?: () => void;
}) {
  const [checked, setChecked] = useState(() => getSetting(setting));
  return (
    <>
      <label>
        <input
          type="checkbox"
          checked={checked}
          onChange={async (e) => {
            const value = e.currentTarget.checked;
            setChecked(value);
            await setSetting(setting, value);
            onChange?.();
          }}
        />
        {label}
      </label>
      {explain && <span class="bbw-explain">{explain}</span>}
    </>
  );
}

function MemoInput<T extends number | string>({
  storageKey,
  prefix,
  suffix,
  defaultValue,
  onChangeEffect,
  ...props
}: {
  storageKey: string;
  prefix?: string;
  suffix?: string;
  defaultValue?: T;
  onChangeEffect: (v: T) => void;
} & InputHTMLAttributes<HTMLInputElement>) {
  const [value, setValue] = useState<T>(() => GM_getValue<T>(storageKey, defaultValue));

  return (
    <label>
      {prefix}
      <input
        {...props}
        value={value}
        onChange={(e) => {
          // Only on the user's changes: the settings panel mounts on every hover, and that must not reopen cams
          const value = e.currentTarget.value as T;
          setValue(value);
          GM.setValue(storageKey, value);
          onChangeEffect(value);
        }}
      />
      {suffix}
    </label>
  );
}

function PanelSizeInput() {
  return (
    <label class="bbw-stacked">
      Max size of the panel
      <MemoInput
        storageKey="config.webcamWidth"
        type="number"
        className="numberOfCams"
        suffix="px"
        min="150"
        step="5"
        defaultValue={gridconf.WIDTH}
        onChangeEffect={(value: string | number) => {
          gridconf.WIDTH = +value;
          gridconf.HEIGHT = +value * panelRatio;
          clickOnCurrentAlgoButton();
        }}
      />
      <span class="bbw-explain">Shrinks automatically when the cams don't fit the screen</span>
    </label>
  );
}

function AlgoSelect() {
  const [value, setValue] = useState<PreferredAlgo>(() => getSetting('preferredAlgo'));

  return (
    <label class="bbw-stacked">
      Which cams to prioritize
      <select
        value={value}
        onChange={(e) => {
          const next = e.currentTarget.value as PreferredAlgo;
          setValue(next);
          setSetting('preferredAlgo', next);
          // Switch the running algorithm right away if cams are currently being opened automatically
          if (getAlgo() !== '') runAlgo(next);
        }}
      >
        {(Object.keys(ALGO_DESCRIPTIONS) as PreferredAlgo[]).map((key) => (
          <option key={key} value={key}>
            {ALGO_DESCRIPTIONS[key].label}
          </option>
        ))}
      </select>
      <span class="bbw-explain">{ALGO_DESCRIPTIONS[value].description}</span>
    </label>
  );
}

function ClassicWidthInput() {
  const [width, setWidth] = useState(() => getSetting('classicWidth'));
  return (
    <label class="bbw-stacked">
      Exact size of the panel
      <span>
        <input
          type="number"
          min="150"
          step="5"
          value={width}
          onChange={async (e) => {
            const value = Math.max(150, parseInt(e.currentTarget.value) || 0);
            setWidth(value);
            await setSetting('classicWidth', value);
            organizePanels();
          }}
        />{' '}
        px
      </span>
      <span class="bbw-explain">Every cam is exactly this wide, whatever the size of the window</span>
    </label>
  );
}

function RowsSelect() {
  const [rows, setRows] = useState(() => getSetting('adaptableRows'));
  return (
    <label class="bbw-stacked">
      Rows
      <select
        value={rows}
        onChange={async (e) => {
          const value = +e.currentTarget.value;
          setRows(value);
          await setSetting('adaptableRows', value);
          organizePanels();
        }}
      >
        {Array.from({ length: MAX_ROWS }, (_, i) => i + 1).map((n) => (
          <option key={n} value={n}>
            {n}
          </option>
        ))}
      </select>
      <span class="bbw-explain">The cams grow or shrink so this many rows fill the window's height</span>
    </label>
  );
}

function LayoutOptions({ layout }: { layout: LayoutName }) {
  if (layout === 'classic') {
    return <ClassicWidthInput />;
  }
  return (
    <>
      <RowsSelect />
      <PanelSizeInput />
    </>
  );
}

/**
 * Switching layouts rearranges every cam, so it waits for "Apply layout"; the options of each layout (shown for the
 * selected one) save right away, and take effect right away when it's the applied one.
 */
function LayoutSettings() {
  const [applied, setApplied] = useState<LayoutName>(() => getSetting('layout'));
  const [selected, setSelected] = useState<LayoutName>(applied);
  const dirty = selected !== applied;

  return (
    <div>
      <div class={`bbw-stacked bbw-layout-picker${dirty ? ' bbw-dirty' : ''}`}>
        <span>
          Layout
          {dirty && (
            <>
              {' (current: '}
              <a
                href="#"
                title="Go back to the current layout"
                onClick={(e) => {
                  e.preventDefault();
                  setSelected(applied);
                }}
              >
                {LAYOUT_LABELS[applied]}
              </a>
              )
            </>
          )}
        </span>
        <div class="bbw-layout-row">
          <select aria-label="Layout" value={selected} onChange={(e) => setSelected(e.currentTarget.value as LayoutName)}>
            {(Object.keys(LAYOUT_LABELS) as LayoutName[]).map((name) => (
              <option key={name} value={name}>
                {LAYOUT_LABELS[name]}
              </option>
            ))}
          </select>
          {dirty && (
            <button
              type="button"
              class="bbw-apply-layout"
              onClick={async () => {
                await setSetting('layout', selected);
                setApplied(selected);
                organizePanels();
              }}
            >
              Apply layout
            </button>
          )}
        </div>
        {dirty && (
          <span class="bbw-explain">
            Switching layouts rearranges every cam, so it waits for this button. Everything else here saves and applies on its
            own.
          </span>
        )}
      </div>
      <ToggleSetting
        setting="camsMoveAway"
        label="Cams move away"
        explain="Rest the pointer on the chat's tabs, or on the buddy list, and the cams in front of them slide out of the way"
        onChange={refreshCamsMoveAway}
      />
      <fieldset>
        <legend>{LAYOUT_LABELS[selected]}</legend>
        <LayoutOptions key={selected} layout={selected} />
        {dirty && <p class="bbw-muted">Saved already; used once you apply this layout.</p>}
      </fieldset>
    </div>
  );
}

function SettingsPanel({ anchor }: { anchor: DOMRect }) {
  const [notifications, setNotifications] = useState(() => getSetting('watchNotifications'));
  const [, setVersion] = useState(0);
  const rerender = () => setVersion((v) => v + 1);

  const style = {
    width: `${PANEL_WIDTH}px`,
    maxWidth: 'calc(100vw - 16px)',
    maxHeight: `calc(100vh - ${anchor.bottom + 12}px)`,
    overflowY: 'auto',
    top: `${anchor.bottom + 4}px`,
    left: `max(8px, min(${anchor.left}px, calc(100vw - ${PANEL_WIDTH + 8}px)))`,
  };

  return (
    <div class="bbw-settings-panel" style={style}>
      <h4>Better BW</h4>
      <div class="bbw-settings-columns">
        <div>
          <label class="bbw-stacked">
            Tell me when someone starts watching me
            <select
              value={notifications}
              onChange={(e) => {
                const value = e.currentTarget.value as WatchNotifications;
                setNotifications(value);
                setSetting('watchNotifications', value);
              }}
            >
              {NOTIFICATIONS.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          {GROUPS.map((group) => (
            <fieldset key={group}>
              <legend>{group}</legend>
              {SITE_OPTIONS.filter((option) => option.group === group && option !== START_MUTED_OPTION).map((option) => (
                <SiteOptionInput key={option.key} option={option} onChange={rerender} />
              ))}
              {group === 'Cams' && (
                <>
                  <AlgoSelect />
                  <VolumePercentInput />
                  <SiteOptionInput option={START_MUTED_OPTION} onChange={rerender} />
                  <ToggleSetting setting="scrollToVolume" label="Scroll wheel changes the volume" />
                  <ToggleSetting setting="pinchToZoom" label="Pinch (or Ctrl + scroll) zooms into the cam" />
                </>
              )}
            </fieldset>
          ))}
          <p class="bbw-muted">The chat's options apply to new messages, buddies and cams.</p>
        </div>
        <LayoutSettings />
      </div>
    </div>
  );
}

// Closing is delayed a bit so moving the pointer from the button to the panel doesn't flicker-close it
const CLOSE_DELAY_MS = 200;

export function SettingsMenu() {
  const [anchor, setAnchor] = useState<DOMRect | null>(null);
  const [pinned, setPinned] = useState(false);
  const root = useRef<HTMLSpanElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>();

  const open = () => {
    clearTimeout(closeTimer.current);
    if (root.current) setAnchor(root.current.getBoundingClientRect());
  };
  const close = () => {
    clearTimeout(closeTimer.current);
    setAnchor(null);
    setPinned(false);
  };
  // Hovering away doesn't close it once a click has pinned it open
  const scheduleClose = () => {
    if (pinned) return;
    clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setAnchor(null), CLOSE_DELAY_MS);
  };

  useEffect(() => {
    if (!anchor) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close();
    };
    document.addEventListener('keydown', closeOnEscape);
    return () => document.removeEventListener('keydown', closeOnEscape);
  }, [anchor]);

  useEffect(() => {
    if (!pinned) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!root.current?.contains(event.target as Node)) close();
    };
    document.addEventListener('mousedown', closeOnOutsideClick);
    return () => document.removeEventListener('mousedown', closeOnOutsideClick);
  }, [pinned]);

  return (
    <span class="bbw-settings" ref={root} onMouseEnter={open} onMouseLeave={scheduleClose}>
      <button
        title="Better BW settings"
        onClick={() => {
          if (pinned) close();
          else {
            open();
            setPinned(true);
          }
        }}
      >
        ⚙
      </button>
      {anchor && <SettingsPanel anchor={anchor} />}
    </span>
  );
}
