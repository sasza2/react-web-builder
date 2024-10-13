import { useGridAPI } from '@/components/GridAPIProvider';
import { removeElementsFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';
import { delay } from '@/utils/delay';
import { getElementFromList } from '@/utils/element';

import { useBreakpoint } from './useBreakpoint';
import { useCreateTreeFromBreakpoint } from './useCreateTreeFromBreakpoint';

export const useRemoveElement = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints[breakpoint.id]);
  const createTreeFromBreakpoint = useCreateTreeFromBreakpoint();

  return async (elementId: string | number) => {
    const selectedElements = getElementFromList(elementId, elementsInBreakpoints);
    const elementsTree = createTreeFromBreakpoint([selectedElements], false);

    dispatch(removeElementsFromBreakpoint({ elementsTree, currentBreakpoint: breakpoint }));
    await delay(200);
    gridAPIRef.current.getPanZoom().goBackToBoundary();
  };
};
