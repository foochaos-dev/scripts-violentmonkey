
export type Algo ='' | 'new' | 'top';

let algo: Algo = '';
export const getAlgo = () => algo;
export const setAlgo = (val: Algo) => algo = val;
