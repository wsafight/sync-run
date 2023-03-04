# sync-run

Eliminate contagious function runtimes for asynchronous code with error trapping。

## Install

```bash
npm install sync-run
```

Or

```bash
yarn install sync-run
```

## Usage

```ts
import { getAsyncFuncWithError, tryRunSyncFunc } from 'sync-run';

const getUserInfo = getAsyncFuncWithError(
  // Asynchronous function, if not passed, the default is fetch
  (name: string, age: number) => {
    return Promise.resolve({
      name,
      age
    });
  },
  // Timeout, if not passed, the default is 1000 milliseconds, that is, 1 second
  100,
  // Parameter passing
  'test',
  12
);

const log = () => {
  // Synchronous method to get user result
  const result = getUserInfo();
  console.log(result);
  // {
  //   name: 'test',
  //   age: 12
  // };
};

tryRunSyncFunc(log);
```

## Upgrade log

- 0.0.3 Complete basic functions and tests
