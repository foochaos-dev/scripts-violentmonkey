type Sortable = {
  bias: number;
  onlineSince: number;
};

const topNewest = (a: Sortable, b: Sortable) => b.bias - a.bias || b.onlineSince - a.onlineSince;

export const topRandom = (a: Sortable, b: Sortable) => b.bias - a.bias || Math.random() - 0.5;
