import type { InputHTMLAttributes } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getAlgo, setAlgo } from '../algo';
import { getCandidates, openCandidates } from '../utils/openPanel';
import { gridconf, organizePanels, panelRatio } from '../utils/organizePanels';
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
  else if (algo === '') organizePanels();
}, 200);

const NumberOfCams = () => {
  const [value, setValue] = useState<StringNumber>(() => GM_getValue('user.webcamMax', 10));
  useEffect(() => {
    const maxWebcamreached = chatHTML5.maxWebcamreached;
    chatHTML5.maxWebcamreached = function () {
      if (!maxWebcamreached()) {
        return false;
      } else {
        chatHTML5.roles.user.webcamMax = +chatHTML5.roles.user.webcamMax + 1;

        return maxWebcamreached();
      }
    };
    const { proxy, revoke } = spyOn(chatHTML5.roles.user, {
      webcamMax: (n) => {
        setValue(n);
        GM_setValue('user.webcamMax', n);
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
      {' cams'}
    </label>
  );
};

const onChangeEffect = (value: string | number): void => {
  gridconf.WIDTH = +value;
  gridconf.HEIGHT = +value * panelRatio;
  clickOnCurrentAlgoButton();
};

const PanelSizeInput = () => {
  return (
    <MemoInput
      storageKey="config.webcamWidth"
      title="Size of the panel"
      type="number"
      className="numberOfCams"
      suffix="px"
      min="150"
      step="5"
      onChangeEffect={onChangeEffect}
    />
  );
};

const MemoInput = <T extends number | string>({
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
} & InputHTMLAttributes<HTMLInputElement>) => {
  const [value, setValue] = useState<T>(() => GM_getValue<T>(storageKey, defaultValue));

  useEffect(() => {
    onChangeEffect(value);
  }, [value]);

  return (
    <label>
      {prefix}
      <input
        {...props}
        value={value}
        onChange={(e) => {
          const value = e.currentTarget.value as T;
          setValue(value);
          GM_setValue(storageKey, value);
        }}
      />
      {suffix}
    </label>
  );
};

export const AlgoControls = () => {
  return (
    <>
      <BtnTop />
      <BtnNew />
      <BtnDisable />
      <NumberOfCams />
      {' @ '}
      <PanelSizeInput />
    </>
  );
};
