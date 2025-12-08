import { useEffect, useState } from 'preact/hooks';
import { getAlgo, setAlgo } from '../algo';
import { getCandidates, openCandidates } from '../utils/openPanel';
import { organizePanels } from '../utils/organizePanels';
import { topRandom } from '../utils/sortFunctions';
import { spyOn } from '../utils/spyOn';
import type { StringNumber } from '../types/utils';
import { debounce } from '../utils/debounce';

const btnDisableClick = () => {
  organizePanels();
  setAlgo('');
};
const BtnDisable = () => (
  <button data-sort-order="" title="Organize open panels and stop the algorithm" onClick={btnDisableClick}>
    ø
  </button>
);

export const btnNewClick = () => {
  setAlgo('new');
  openCandidates(getCandidates(topRandom, { undefined: 9, '+': 8 }));
};
const BtnNew = () => (
  <button data-sort-order="new" title="Prioritize users you haven't liked/disliked before" onClick={btnNewClick}>
    New
  </button>
);

const btnTopClick = () => {
  setAlgo('top');
  openCandidates(getCandidates(topRandom));
};
const BtnTop = () => (
  <button data-sort-order="top" title="Prioritize users you liked more" onClick={btnTopClick}>
    Top
  </button>
);

export const clickOnCurrentAlgoButton = debounce((): void => {
  const algo = getAlgo();
  if (algo === 'new') btnNewClick();
  else if (algo === 'top') btnTopClick();
}, 200);

const NumberOfCams = () => {
  const [value, setValue] = useState(() => chatHTML5.roles.user.webcamMax);
  useEffect(() => {
    const maxWebcamreached = chatHTML5.maxWebcamreached;
    chatHTML5.maxWebcamreached = function () {
      if (!maxWebcamreached()) {
        return false;
      } else {
        chatHTML5.roles.user.webcamMax = +chatHTML5.roles.user.webcamMax + 1;
        setValue(chatHTML5.roles.user.webcamMax);
        return maxWebcamreached();
      }
    };
    const { proxy, revoke } = spyOn(chatHTML5.roles.user, { webcamMax: setValue });
    chatHTML5.roles.user = proxy;

    return () => {
      chatHTML5.maxWebcamreached = maxWebcamreached;
      revoke();
    };
  }, []);
  return (
    <input
      title="# of open cams"
      type="number"
      className="numberOfCams"
      value={value}
      onChange={(e) => {
        chatHTML5.roles.user.webcamMax = +e.currentTarget.value as StringNumber;
        clickOnCurrentAlgoButton();
      }}
    />
  );
};

export const AlgoControls = () => {
  return (
    <>
      <BtnTop />
      <BtnNew />
      <BtnDisable />
      <NumberOfCams />
    </>
  );
};
