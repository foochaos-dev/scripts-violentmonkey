import { useEffect, useState } from 'preact/hooks';
import { getWatchStats, isTransmitting, subscribeWatchStats, type PeakKey } from './watchStats';

const CARD_WIDTH = 330;
const CARD_MAX_HEIGHT = 340;

const int = (n: number) => Math.round(n).toLocaleString();
const pct = (n: number) => `${Math.round(n * 100)}%`;
const average = ({ watchedMs, watcherMs }: { watchedMs: number; watcherMs: number }) =>
  watchedMs ? (watcherMs / watchedMs).toFixed(1) : '–';
const date = (at: number) => new Date(at).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

function duration(ms: number) {
  const minutes = Math.floor(ms / 60_000);
  if (minutes < 1) return `${Math.floor(ms / 1000)}s`;
  if (minutes < 60) return `${minutes}m`;
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}

const PEAK_ROWS: [PeakKey, string, (n: number) => string][] = [
  ['watchers', 'Watching you', int],
  ['onCam', '…with their cam on', int],
  ['mutual', '…whose cam you watch', int],
  ['roomShare', 'Share of the room', pct],
  ['camsShare', 'Share of the cams', pct],
];

function StatsCard({ anchor }: { anchor: DOMRect }) {
  const { now, session, ever, paused } = getWatchStats();
  const below = anchor.bottom + CARD_MAX_HEIGHT < innerHeight;
  const style = {
    width: `${CARD_WIDTH}px`,
    left: `max(8px, min(${anchor.left}px, calc(100vw - ${CARD_WIDTH + 8}px)))`,
    top: `${below ? anchor.bottom + 6 : anchor.top - 6}px`,
    transform: below ? '' : 'translateY(-100%)',
  };
  const regulars = Object.entries(ever.regulars)
    .filter(([, sessions]) => sessions > 1)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  return (
    <div class="bbw-watch-card" style={style}>
      <table>
        <thead>
          <tr>
            <th />
            <th>Now</th>
            <th>Session</th>
            <th>Ever</th>
          </tr>
        </thead>
        <tbody>
          {PEAK_ROWS.map(([key, label, format]) => (
            <tr key={key}>
              <th>{label}</th>
              <td>{paused ? '–' : format(now[key])}</td>
              <td>{format(session.peaks[key].value)}</td>
              <td>{format(ever.peaks[key].value)}</td>
            </tr>
          ))}
          <tr class="bbw-separator">
            <th>Unique watchers</th>
            <td />
            <td>{int(session.watchers.size)}</td>
            <td>{int(Object.keys(ever.regulars).length)}</td>
          </tr>
          <tr>
            <th>Watched for</th>
            <td />
            <td>{duration(session.watchedMs)}</td>
            <td>{duration(ever.watchedMs)}</td>
          </tr>
          <tr>
            <th>Average watchers</th>
            <td />
            <td>{average(session)}</td>
            <td>{average(ever)}</td>
          </tr>
        </tbody>
      </table>
      {paused && (
        <p>
          <b>Paused:</b> only counted while the Bateworld tab is open
        </p>
      )}
      <p class="bbw-muted">Top rows: the most at once. Averages count only the time someone was watching.</p>
      {ever.peaks.watchers.at > 0 && (
        <p>
          Record: <b>{int(ever.peaks.watchers.value)}</b> watchers, on {date(ever.peaks.watchers.at)}
        </p>
      )}
      {regulars.length > 0 && <p>Regulars: {regulars.map(([name, sessions]) => `${name} (${sessions})`).join(', ')}</p>}
      <p class="bbw-muted">
        Watched in {int(ever.sessions)} sessions since {date(ever.since)}
      </p>
    </div>
  );
}

export function WatchStats() {
  const [, setVersion] = useState(0);
  useEffect(() => subscribeWatchStats(() => setVersion((v) => v + 1)), []);
  const [anchor, setAnchor] = useState<DOMRect | null>(null);

  const { session, ever } = getWatchStats();
  const showSession = isTransmitting() || session.peaks.watchers.value > 0;

  return (
    <span
      class="bbw-watch-stats"
      onMouseEnter={(e) => setAnchor(e.currentTarget.getBoundingClientRect())}
      onMouseLeave={() => setAnchor(null)}
    >
      <span class="bbw-watch-summary">
        max {int(ever.peaks.watchers.value)}
        {showSession && ` · session ${int(session.peaks.watchers.value)}`}
      </span>
      {anchor && <StatsCard anchor={anchor} />}
    </span>
  );
}
