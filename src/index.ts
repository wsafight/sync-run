export const fetchWithError = <Result>(queryFunc: any, ...fetchParams: any) => {
  let result: Result | null = null;
  let error: Error | null = null;

  let finalQueryFunc = queryFunc;
  const finalQueryParams = [...fetchParams];
  if (typeof queryFunc !== 'function') {
    finalQueryFunc = fetch;
    finalQueryParams.unshift(queryFunc);
  }

  return () => {
    if (result) {
      return result;
    }
    if (error) {
      throw error;
    }
    const _curQuery = finalQueryFunc(...finalQueryParams)
      .then((res: Result) => {
        result = res;
      })
      .catch((err: Error) => {
        error = err;
      });
    throw _curQuery;
  };
};

export const tryRunSync = (syncFun: () => void) => {
  try {
    syncFun();
  } catch (err) {
    if (err instanceof Promise) {
      err
        .then(() => {
          syncFun();
        })
        .catch(() => {
          syncFun();
        });
      return;
    }
    throw err;
  }
};
