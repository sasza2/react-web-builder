import { Breakpoint } from 'types';

import { getBreakpointPadding } from '@/utils/breakpoint';

const getBreakpointWidth = (breakpoint: Breakpoint) => {
  const padding = getBreakpointPadding(breakpoint);
  return breakpoint.from - padding.left - padding.right;
};

export default getBreakpointWidth;
