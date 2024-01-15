import { Breakpoint } from 'types';
import { useAppDispatch } from '@/store/useAppDispatch';
import { removeBreakpoint } from '@/store/breakpointsSlice';

export const useRemoveBreakpoint = () => {
  const dispatch = useAppDispatch();

  const remove = (breakpoint: Breakpoint) => {
    dispatch(removeBreakpoint({ breakpoint }));
  };

  return remove;
};
