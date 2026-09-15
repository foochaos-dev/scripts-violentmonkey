export type Algo = '' | 'new' | 'top';
/** The two real strategies; '' (off) isn't chosen in settings, only via the play/pause button */
export type PreferredAlgo = 'new' | 'top';

let algo: Algo = '';
export const getAlgo = () => algo;
export const setAlgo = (val: Algo) => {
  document.body.dataset.algo = algo = val;
};
