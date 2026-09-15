import { useEffect, useState } from 'preact/hooks';
import { type PreferredAlgo, getAlgo, setAlgo } from '../algo';
import { getCandidates, openCandidates } from '../utils/openPanel';
import { organizePanels } from '../utils/organizePanels';
import { topRandom } from '../utils/sortFunctions';
import { spyOn } from '../utils/spyOn';
import type { StringNumber } from '../types/utils';
import { debounce } from '../utils/debounce';
import { getSetting } from './settings';

export const ALGO_DESCRIPTIONS: Record<PreferredAlgo, { label: string; description: string }> = {
  top: { label: 'Top', description: 'Prioritize users you liked more' },
  new: { label: 'New', description: "Prioritize users you haven't liked/disliked before" },
};

export async function runAlgo(preferredAlgo: PreferredAlgo) {
  setAlgo(preferredAlgo);
  const biases = preferredAlgo === 'new' ? { undefined: 9, '+': 8 } : {};
  openCandidates(await getCandidates(topRandom, biases));
}

export const clickOnCurrentAlgoButton = debounce((): void => {
  const algo = getAlgo();
  if (algo === 'new' || algo === 'top') runAlgo(algo);
  else organizePanels();
});

export const ResetLayoutButton = () => (
  <button title="Reset the cams' grid layout" onClick={organizePanels}>
    ▦
  </button>
);

export const PlayPauseButton = () => {
  // Mounts before the initial algorithm run kicks in (see betterbw.user.ts main()), which always starts playing
  const [playing, setPlaying] = useState(true);

  return (
    <button
      title={playing ? 'Stop opening cams automatically' : 'Start opening cams automatically'}
      onClick={async () => {
        if (playing) {
          setAlgo('');
          organizePanels();
          setPlaying(false);
        } else {
          await runAlgo(getSetting('preferredAlgo'));
          setPlaying(true);
        }
      }}
    >
      {playing ? '⏸' : '▶'}
    </button>
  );
};

export const NumberOfCams = () => {
  const [value, setValue] = useState<StringNumber>(() => GM_getValue('user.webcamMax', 10));
  useEffect(() => {
    const maxWebcamreached = chatHTML5.maxWebcamreached;
    chatHTML5.maxWebcamreached = function () {
      if (!maxWebcamreached()) {
        return false;
      } else {
        chatHTML5.roles.user.webcamMax = chatHTML5.getWebcamNumber() + 1;

        return maxWebcamreached();
      }
    };
    const { proxy, revoke } = spyOn(chatHTML5.roles.user, {
      webcamMax: (n) => {
        setValue(n);
        GM.setValue('user.webcamMax', n);
      },
    });
    chatHTML5.roles.user = proxy;

    return () => {
      chatHTML5.maxWebcamreached = maxWebcamreached;
      revoke();
    };
  }, []);

  useEffect(() => {
    clickOnCurrentAlgoButton();
  }, [value]);

  return (
    <label>
      <input
        title="# of open cams"
        type="number"
        className="numberOfCams"
        value={value}
        onChange={(e) => {
          chatHTML5.roles.user.webcamMax = +e.currentTarget.value as StringNumber;
        }}
      />
    </label>
  );
};
