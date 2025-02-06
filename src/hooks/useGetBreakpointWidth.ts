import { useCallback } from 'react';
import { Breakpoint, WebBuilderElement } from 'types';

import { useAppSelector } from '@/store/useAppSelector';
import { byBreakpointId, getBreakpointPadding, isContainer } from '@/utils/breakpoint';
import { getElementContainerIdProp } from '@/utils/element';

import { useBreakpoints } from './useBreakpoints';

export const useGetBreakpointWidth = () => {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const getBreakpointWidth = useCallback((breakpoint: Breakpoint): number => {
    const padding = getBreakpointPadding(breakpoint);
    if (!isContainer(breakpoint)) return breakpoint.from - padding.left - padding.right;

    const parent = breakpoints.find(byBreakpointId(breakpoint.parentId));
    if (!parent) return 0;

    const elements = elementsInBreakpoints[parent.id] || [];

    const containerElement = elements.find(({ props }: WebBuilderElement): string | null => {
      const containerId = getElementContainerIdProp(props);
      if (containerId && containerId.value === breakpoint.id) return containerId.value;
      return null;
    });

    if (!containerElement) return breakpoint.from;

    const parentWidth = getBreakpointWidth(parent);
    return (containerElement.w / parent.cols) * parentWidth;
  }, [breakpoints, elementsInBreakpoints]);

  return getBreakpointWidth;
};
