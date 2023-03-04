import { getAsyncFuncWithError, tryRunSyncFunc } from '../src';

describe('Default cases', () => {
  test('asyncFuncWithError', () => {
    const asyncFunc = getAsyncFuncWithError(() => {
      return Promise.resolve(123);
    });
    try {
      asyncFunc();
    } catch (e) {
      expect(e instanceof Promise).toBe(true);
    }
  });

  test('tryRunSyncFunc', () => {
    const getUserInfo = getAsyncFuncWithError(() => {
      return Promise.resolve({
        name: 'test'
      });
    });

    const log = () => {
      const result = getUserInfo();
      expect(result).toStrictEqual({
        name: 'test'
      });
    };

    // miss return
    tryRunSyncFunc(log);
  });

  test('tryRunSyncFuncParams', () => {
    const getUserInfo = getAsyncFuncWithError(
      (name: string, age: number) => {
        return Promise.resolve({
          name,
          age
        });
      },
      100,
      'test',
      12
    );

    const log = () => {
      const result = getUserInfo();
      expect(result).toStrictEqual({
        name: 'test',
        age: 12
      });
    };

    // miss return
    tryRunSyncFunc(log);
  });

  test('tryRunSyncFuncExpiredOk', async () => {
    let time = 1;
    const getUserInfo = getAsyncFuncWithError(
      (name: string, age: number) => {
        return Promise.resolve({
          name,
          age,
          time: time++
        });
      },
      2000,
      'test',
      12
    );

    const log = () => {
      const result = getUserInfo();
      expect(result).toStrictEqual({
        name: 'test',
        age: 12,
        time: 1
      });
    };

    // miss return
    tryRunSyncFunc(log);
    tryRunSyncFunc(log);
    await new Promise<void>(resolve => {
      setTimeout(() => {
        tryRunSyncFunc(log);
        resolve();
      }, 1000);
    });
  });

  test('tryRunSyncFuncExpiredError', async () => {
    let time = 1;
    const getUserInfo = getAsyncFuncWithError(
      (name: string, age: number) => {
        return Promise.resolve({
          name,
          age,
          time: time++
        });
      },
      200,
      'test',
      12
    );

    let okExecTime = 0;
    const log = () => {
      const result = getUserInfo();
      // 成功执行次数
      okExecTime++;
      expect(result).toStrictEqual({
        name: 'test',
        age: 12,
        time: okExecTime === 3 ? 2 : 1
      });
    };

    // miss return
    tryRunSyncFunc(log);
    tryRunSyncFunc(log);
    await new Promise<void>(resolve => {
      setTimeout(() => {
        tryRunSyncFunc(log);
        resolve();
      }, 1000);
    });
  });
});
