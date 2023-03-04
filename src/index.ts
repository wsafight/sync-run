const getAsyncFuncWithError = <Result>(
  asyncFunc: any = fetch,
  timeout = 1000,
  ...params: any
) => {
  let result: Result | null = null;
  let error: Error | null = null;
  let curQuery: Promise<Result> | null = null;

  let expiration = -1;

  return () => {
    const now = new Date().getTime();

    if (expiration !== -1 && now > expiration) {
      result = null;
      error = null;
      curQuery = null;
    }

    if (result) {
      return result;
    }

    if (error) {
      throw error;
    }

    if (curQuery) {
      throw curQuery;
    }

    curQuery = asyncFunc(...params)
      .then((res: Result) => {
        result = res;
        expiration = new Date().getTime() + timeout;
      })
      .catch((err: Error) => {
        error = err;
        expiration = new Date().getTime() + timeout;
      });
    throw curQuery;
  };
};

const tryRunSyncFunc = (syncFun: () => void) => {
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

export { getAsyncFuncWithError, tryRunSyncFunc };
