import { useGridAPI } from '@/components/GridAPIProvider';
import { removeElementsFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';
import { delay } from '@/utils/delay';

import { useBreakpoint } from './useBreakpoint';
import { useCreateTreeFromBreakpoint } from './useCreateTreeFromBreakpoint';
import { useSelectedElements } from './useSelectedElements';

type UseRemoveSelectedElements = () => () => void;

const useRemoveSelectedElements: UseRemoveSelectedElements = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();
  const { selectedElements } = useSelectedElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints[breakpoint.id]);
  const createTreeFromBreakpoint = useCreateTreeFromBreakpoint();
  const gridAPIRef = useGridAPI();

  const remove = async () => {
    const elementsTree = createTreeFromBreakpoint(elementsInBreakpoints.filter((element) => selectedElements.includes(element.id)), false);

    dispatch(removeElementsFromBreakpoint({
      elementsTree,
      currentBreakpoint: breakpoint,
    }));

    await delay(200);
    gridAPIRef.current.getPanZoom().goBackToBoundary();
  };

  return remove;
};

export default useRemoveSelectedElements;
