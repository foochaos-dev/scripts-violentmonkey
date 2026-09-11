export type Sortable = {
  bias: number;
  onlineSince: number;
};

export const topRandom = (a: Sortable, b: Sortable) => b.bias - a.bias || Math.random() - 0.5;
