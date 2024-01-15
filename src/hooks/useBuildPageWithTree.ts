import { Page, WebBuilderElements } from 'types';

import createTreeElements from '@/components/View/createTreeElements';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { useAppSelector } from '@/store/useAppSelector';
import { getPageSettings } from '@/utils/pageSettings';
import { useBreakpoints } from './useBreakpoints';
import { useElements } from './useElements';
import { usePageSettings } from './usePageSettings';

export const useBuildPageWithTree = () => {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elementsExtras } = useElements();
  const pageSettings = usePageSettings();

  const build = (): Page => {
    const elements: WebBuilderElements = [];
    Object.entries(elementsInBreakpoints).forEach(([breakpointId, elementsInBreakpoint]) => {
      elementsInBreakpoint.forEach((element) => {
        elements.push({
          ...element,
          breakpointId,
        });
      });
    });

    const breakpointsWithTree = breakpoints.map((breakpoint) => {
      const elementsInBreakpoint = elementsInBreakpoints[breakpoint.id] || [];

      if (!elementsInBreakpoint.length) return breakpoint;
      return {
        ...breakpoint,
        view: createTreeElements(
          elementsInBreakpoint,
          elementsExtras.current[breakpoint.id] || {},
          breakpoint.cols,
          getBreakpointRowsByLastElement(elementsInBreakpoint, elementsExtras.current[breakpoint.id] || {}),
        ),
      };
    }).filter((breakpoint) => breakpoint.view);

    return {
      ...getPageSettings(pageSettings),
      breakpoints: breakpointsWithTree,
      elementsInBreakpoints,
      elementsExtras: elementsExtras.current,
    };
  };

  return build;
};
