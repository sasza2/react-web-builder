import { useAppDispatch } from '@/store/useAppDispatch';
import { setSelectedBreakpoint } from '@/store/selectedBreakpointSlice';

export const useSelectBreakpoint = () => {
  const dispatch = useAppDispatch();

  const select = (breakpointId: string | null) => {
    dispatch(setSelectedBreakpoint({ breakpointId }));
  };

  return select;
};
