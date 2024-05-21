import { useGridAPI } from '@/components/GridAPIProvider';
import { removeElementFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { delay } from '@/utils/delay';
import { useBreakpoint } from './useBreakpoint';

export const useRemoveElement = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();

  return async (elementId: string | number) => {
    dispatch(removeElementFromBreakpoint({ elementId, breakpointId: breakpoint.id }));
    await delay(200)
    gridAPIRef.current.getPanZoom().goBackToBoundary()
  };
};
