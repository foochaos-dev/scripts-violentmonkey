import { useState } from 'preact/hooks';

const SEEN_KEY = 'discovery.headerControlsMoved';

/** A single one-off callout pointing at the header controls, for anyone (including fresh installs) who hasn't seen them there */
export function HeaderControlsDiscovery() {
  const [seen, setSeen] = useState(() => GM_getValue(SEEN_KEY, false));
  if (seen) return null;

  const dismiss = () => {
    GM.setValue(SEEN_KEY, true);
    setSeen(true);
  };

  return (
    <div class="bbw-discovery" onClick={dismiss}>
      Better BW's controls moved here
      <button onClick={dismiss}>Got it</button>
    </div>
  );
}
