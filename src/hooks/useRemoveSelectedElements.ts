import { removeElementsFromBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useSelectedElements } from './useSelectedElements';
import { useBreakpoint } from './useBreakpoint';

type UseRemoveSelectedElements = () => () => void;

const useRemoveSelectedElements: UseRemoveSelectedElements = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();
  const { selectedElements } = useSelectedElements();

  const remove = () => {
    dispatch(removeElementsFromBreakpoint({
      elementsIds: selectedElements,
      breakpointId: breakpoint.id,
    }));
  };

  return remove;
};

export default useRemoveSelectedElements;
