const topNewest = (a, b) => b.bias - a.bias || b.onlineSince - a.onlineSince;

export const topRandom = (a, b) => b.bias - a.bias || Math.random() - 0.5;
