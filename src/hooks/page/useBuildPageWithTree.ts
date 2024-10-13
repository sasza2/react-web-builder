import { Page, WebBuilderElements } from 'types';

import { useAppSelector } from '@/store/useAppSelector';
import { getPageSettings } from '@/utils/pageSettings';

import { useBreakpoints } from '../useBreakpoints';
import { useElements } from '../useElements';
import { usePageSettings } from '../usePageSettings';
import { useBuildBreakpointWithTree } from './useBuildBreakpointWithTree';

export const useBuildPageWithTree = () => {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elementsExtras } = useElements();
  const pageSettings = usePageSettings();
  const buildBreakpointWithTree = useBuildBreakpointWithTree();

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

    const breakpointsWithTree = breakpoints.map(buildBreakpointWithTree).filter((breakpoint) => breakpoint.view);

    return {
      ...getPageSettings(pageSettings),
      breakpoints: breakpointsWithTree,
      elementsInBreakpoints,
      elementsExtras: elementsExtras.current,
    };
  };

  return build;
};
