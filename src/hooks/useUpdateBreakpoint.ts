import { Breakpoint } from 'types';
import { updateBreakpoint } from '@/store/breakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';

export const useUpdateBreakpoint = () => {
  const dispatch = useAppDispatch();

  const update = (breakpointId: string, breakpoint: Partial<Breakpoint>) => {
    dispatch(updateBreakpoint({ breakpointId, breakpoint }));
  };

  return update;
};

export default useUpdateBreakpoint;
