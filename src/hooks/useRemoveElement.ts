import { removeElementFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useBreakpoint } from './useBreakpoint';

export const useRemoveElement = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();

  return (elementId: string | number) => {
    dispatch(removeElementFromBreakpoint({ elementId, breakpointId: breakpoint.id }));
  };
};
