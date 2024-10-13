import { useMemo } from 'react';
import { Breakpoint, WebBuilderElement } from 'types';

import { byBreakpointId } from '@/utils/breakpoint';
import { getElementContainerIdProp, getElementFromList } from '@/utils/element';

import { useBreakpoints } from '../useBreakpoints';
import { useElements } from '../useElements';
import { useSelectedElementId } from '../useSelectedElementId';

export const useSelectedContainer = (): [WebBuilderElement, Breakpoint] => {
  const { elements } = useElements();
  const [selectedElementId] = useSelectedElementId();
  const element = useMemo(() => getElementFromList(selectedElementId, elements), [selectedElementId, elements]);
  const breakpoints = useBreakpoints();

  const containerId = useMemo(() => {
    if (!element) return null;

    const prop = getElementContainerIdProp(element.props);
    return prop.value as string;
  }, [element]);

  const container = useMemo(() => {
    const breakpoint = breakpoints.find(byBreakpointId(containerId));
    return breakpoint;
  }, [breakpoints, containerId]);

  return [element, container];
};
