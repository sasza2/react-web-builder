import type { Breakpoint } from 'types';

import createTreeElements from '@/components/View/createTreeElements';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { useAppSelector } from '@/store/useAppSelector';

import { useElements } from '../useElements';

export const useBuildBreakpointWithTree = () => {
  const { elementsExtras } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const build = (breakpoint: Breakpoint): Breakpoint => {
    const elementsInBreakpoint = elementsInBreakpoints[breakpoint.id] || [];

    return {
      ...breakpoint,
      view: createTreeElements(
        elementsInBreakpoint,
        elementsExtras.current[breakpoint.id] || {},
        breakpoint.cols,
        getBreakpointRowsByLastElement(elementsInBreakpoint, elementsExtras.current[breakpoint.id] || {}),
      ),
    };
  };

  return build;
};
