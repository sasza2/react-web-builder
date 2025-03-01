import { useEffect, useRef } from 'react';

const CONTINUE_WAITING_TIME = 4000; // ms
const MAX_WAITING_TIME = 30000; // ms

export const useBreakpointWaitForLoad = (): [React.MutableRefObject<Promise<void>>, () => void] => {
  const promiseResolveRef = useRef<() => void>();
  const promiseRef = useRef<Promise<void>>();
  if (!promiseRef.current) {
    promiseRef.current = new Promise((resolve) => {
      promiseResolveRef.current = resolve;
    });
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      promiseResolveRef.current();
    }, MAX_WAITING_TIME);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  const continueWaiting = () => {
    clearTimeout(timeoutRef.current);

    timeoutRef.current = setTimeout(() => {
      promiseResolveRef.current();
    }, CONTINUE_WAITING_TIME);
  };

  if (!timeoutRef.current) {
    continueWaiting();
  }

  return [promiseRef, continueWaiting];
};
