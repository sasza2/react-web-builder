import { Breakpoint } from 'types';
import { removeAllByBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';

type UseRemoveElementsByBreakpoint = () => (breakpoint: Breakpoint) => void;

const useRemoveElementsByBreakpoint: UseRemoveElementsByBreakpoint = () => {
  const dispatch = useAppDispatch();

  const remove = (breakpoint: Breakpoint) => {
    dispatch(removeAllByBreakpoint({ breakpointId: breakpoint.id }));
  };

  return remove;
};

export default useRemoveElementsByBreakpoint;
