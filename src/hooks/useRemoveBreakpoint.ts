import type { Breakpoint } from 'types';

import { removeBreakpoint } from '@/store/breakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';

export const useRemoveBreakpoint = () => {
  const dispatch = useAppDispatch();

  const remove = (breakpoint: Breakpoint) => {
    dispatch(removeBreakpoint({ breakpoint }));
  };

  return remove;
};
