import { WebBuilderElements } from 'types';
import { setElementsInBreakpointProgrammatic } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useBreakpoint } from './useBreakpoint';

export const useSetElementsProgrammatic = () => {
  const dispatch = useAppDispatch();
  const breakpoint = useBreakpoint();

  const setElementsProgrammatic = (elements: WebBuilderElements) => {
    dispatch(setElementsInBreakpointProgrammatic({
      elements,
      breakpointId: breakpoint.id,
    }));
  };

  return setElementsProgrammatic;
};
