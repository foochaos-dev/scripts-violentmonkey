export const clamp = (min: number, mid: number, max: number) => Math.max(min, Math.min(mid, max));

export const fixedFloat = (num: number, decimals: number) => {
  const factor = 10 ** decimals;
  return Math.round(num * factor) / factor;
};
