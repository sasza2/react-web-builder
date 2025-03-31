export type WithResolvers = {
  promise: Promise<void>,
  resolve: () => void,
  reject: () => void,
};

// TODO https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/withResolvers
export const withResolvers = (): WithResolvers => {
  let resolve: WithResolvers['resolve'];
  let reject: WithResolvers['reject'];

  const promise = new Promise<void>((resolveIn, rejectIn) => {
    resolve = resolveIn;
    reject = rejectIn;
  });

  return { promise, resolve, reject };
};
