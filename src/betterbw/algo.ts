export type Algo = '' | 'new' | 'top';

let algo: Algo = '';
export const getAlgo = () => algo;
export const setAlgo = (val: Algo) => {
  document.body.dataset.algo = algo = val;
};
