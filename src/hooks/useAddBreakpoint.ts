import { useDispatch } from 'react-redux';

import { Breakpoint } from 'types';
import { addBreakpoint } from '@/store/breakpointsSlice';
import { createUniqueId } from '@/utils/createUniqueId';

export const useAddBreakpoint = () => {
  const dispatch = useDispatch();

  const add = (breakpointWithoutId: Omit<Breakpoint, 'id'>): Breakpoint => {
    const breakpoint = {
      ...breakpointWithoutId,
      id: createUniqueId(),
    };
    dispatch(addBreakpoint({ breakpoint }));

    return breakpoint;
  };

  return add;
};
