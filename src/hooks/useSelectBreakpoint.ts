import { setSelectedBreakpoint } from '@/store/selectedBreakpointSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { byBreakpointId } from '@/utils/breakpoint';

import { useBreakpoints } from './useBreakpoints';

export const useSelectBreakpoint = () => {
  const dispatch = useAppDispatch();
  const breakpoints = useBreakpoints();

  const select = (breakpointId: string | null) => {
    const breakpoint = breakpoints.find(byBreakpointId(breakpointId)) || null;
    dispatch(setSelectedBreakpoint(breakpoint || { id: null }));
  };

  return select;
};
