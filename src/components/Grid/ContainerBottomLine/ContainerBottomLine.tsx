import React, { useMemo } from 'react';
import type { Breakpoint, BreakpointHeight } from 'types';

import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useAppSelector } from '@/store/useAppSelector';
import { byBreakpointId } from '@/utils/breakpoint';
import { getElementContainerIdProp } from '@/utils/element';

import { Line } from './ContainerBottomLine.styled';

type ContainerBottomLineProps = {
  breakpoint: Breakpoint,
};

export function ContainerBottomLine({ breakpoint }: ContainerBottomLineProps) {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const breakpointHeight = useMemo<number | null>(() => {
    if (!breakpoint.parentId) return null;

    const parentBreakpoint = breakpoints.find(byBreakpointId(breakpoint.parentId));
    if (!parentBreakpoint) return null;

    const elements = elementsInBreakpoints[parentBreakpoint.id];

    const element = elements.find((item) => {
      if (item.componentName !== 'Container') return false;

      const containerIdProp = getElementContainerIdProp(item.props);
      if (!containerIdProp) return false;

      return containerIdProp.value === breakpoint.id;
    });

    if (!element) return null;

    const breakpointHeightProp = element.props.find((prop) => prop.propId === 'breakpointHeight');
    if (!breakpointHeightProp) return null;

    const breakpointHeightValue = breakpointHeightProp.value as BreakpointHeight;
    if (!breakpointHeightValue || !breakpointHeightValue.height) return null;

    return Math.floor(breakpointHeightValue.height) || null;
  }, [breakpoint, breakpoints, elementsInBreakpoints]);

  if (!breakpointHeight) return null;
  return <Line $top={breakpointHeight} />;
}
