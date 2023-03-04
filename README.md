# sync-run

Read this in other languages:
[English](https://github.com/wsafight/sync-fun/blob/main/README.EN.md)

通过错误捕获消除异步代码的传染性函数运行库。

开发历程可以参考博客
[消除异步代码的传染性库 sync-run](https://github.com/wsafight/personBlog/issues/57)

## 安装

```bash
npm install sync-run
```

或者

```bash
yarn install sync-run
```

## 用法

```ts
import { getAsyncFuncWithError, tryRunSyncFunc } from 'sync-run';

const getUserInfo = getAsyncFuncWithError(
  // 异步函数，不传默认为 fetch
  (name: string, age: number) => {
    return Promise.resolve({
      name,
      age
    });
  },
  // 超时时间,不传默认为 1000,即 1 秒
  100,
  // 参数传递
  'test',
  12
);

const log = () => {
  // 同步方法获取用户结果
  const result = getUserInfo();
  console.log(result);
  // {
  //   name: 'test',
  //   age: 12
  // };
};

tryRunSyncFunc(log);
```

## 升级日志

- 0.0.3 完成基本功能以及测试
