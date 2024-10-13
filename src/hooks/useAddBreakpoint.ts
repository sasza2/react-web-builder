import { useDispatch } from 'react-redux';
import { Breakpoint } from 'types';

import { addBreakpoint, addBreakpointSilent } from '@/store/breakpointsSlice';
import { createUniqueId } from '@/utils/createUniqueId';

type Options = {
  silent: boolean,
};

export const useAddBreakpoint = () => {
  const dispatch = useDispatch();

  const add = (breakpointWithoutId: Omit<Breakpoint, 'id'>, options?: Options): Breakpoint => {
    const breakpoint = {
      ...breakpointWithoutId,
      id: createUniqueId(),
    };

    const action = options?.silent
      ? addBreakpointSilent
      : addBreakpoint;

    dispatch(action({ breakpoint }));

    return breakpoint;
  };

  return add;
};
