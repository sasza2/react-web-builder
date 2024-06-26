import { removeElementsFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';
import { useSelectedElements } from './useSelectedElements';
import { useBreakpoint } from './useBreakpoint';
import { useCreateTreeFromBreakpoint } from './useCreateTreeFromBreakpoint';
import { delay } from '@/utils/delay';
import { useGridAPI } from '@/components/GridAPIProvider';

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
