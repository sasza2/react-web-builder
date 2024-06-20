import { useAppDispatch } from '@/store/useAppDispatch';
import { setSelectedBreakpoint } from '@/store/selectedBreakpointSlice';
import { byBreakpointId } from '@/utils/breakpoint';
import { useBreakpoints } from './useBreakpoints';

export const useSelectBreakpoint = () => {
  const dispatch = useAppDispatch();
  const breakpoints = useBreakpoints();

  const select = (breakpointId: string | null) => {
    const breakpoint = breakpoints.find(byBreakpointId(breakpointId)) || null;
    dispatch(setSelectedBreakpoint(breakpoint));
  };

  return select;
};
