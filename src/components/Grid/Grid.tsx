import React from 'react';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { BreakpointGrid } from './BreakpointGrid';
import { getBreakpointKey } from './utils';

export function Grid() {
  const breakpoint = useBreakpoint();
  if (!breakpoint || !breakpoint.id) return null;

  const key = getBreakpointKey(breakpoint);
  return (
    <BreakpointGrid key={key} />
  );
}
