import { Breakpoint } from 'types';

import { getBreakpointPadding } from '@/utils/breakpoint';

export const getBreakpointKey = (breakpoint: Breakpoint) => {
  const padding = getBreakpointPadding(breakpoint);
  return `${breakpoint.id}-${breakpoint.from}-${padding.left}-${padding.right}`;
};
