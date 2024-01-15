import { useCallback } from 'react';

import { useBreakpoint } from './useBreakpoint';
import { useSetElements } from './useSetElements';

export const useClearBreakpoint = () => {
  const breakpoint = useBreakpoint();
  const setElements = useSetElements();

  const clear = useCallback(() => {
    if (breakpoint?.id) setElements([]);
  }, [breakpoint?.id, setElements]);

  return clear;
};
