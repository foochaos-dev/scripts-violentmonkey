export function debounce(func: Function, wait: number = 200) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (...args) {
    // @ts-expect-error -- this should be set at runtime
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

export function enqueueAsync(func: Function) {
  let isRunning = false;
  let runAgain = false;

  return async () => {
    if (isRunning) {
      runAgain = true;
      return;
    }

    isRunning = true;
    try {
      do {
        runAgain = false;
        await func();
      } while (runAgain);
    } finally {
      // Otherwise a single failure would block every future run
      isRunning = false;
    }
  };
}
