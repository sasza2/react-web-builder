import { copy } from '@/utils/clipboard';
import createTreeElements from '@/components/View/createTreeElements';
import { useAppSelector } from '@/store/useAppSelector';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { useElements } from './useElements';
import { useBreakpoint } from './useBreakpoint';

export const useCopyElements = () => {
  const breakpoint = useBreakpoint();
  const { elements } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elementsExtras } = useElements();

  const copyElement = (elementId: string | number) => {
    const element = elements.find((item) => item.id === elementId);
    if (!element) return;

    copy({
      breakpoint: {
        cols: breakpoint.cols,
      },
      element,
      type: 'element',
    });
  };

  const copyAllElements = () => {
    const elementsInBreakpoint = elementsInBreakpoints[breakpoint.id] || [];

    const tree = createTreeElements(
      elementsInBreakpoint,
      elementsExtras.current[breakpoint.id] || {},
      breakpoint.cols,
      getBreakpointRowsByLastElement(elementsInBreakpoint, elementsExtras.current[breakpoint.id] || {}),
    );

    copy({
      breakpoint: {
        cols: breakpoint.cols,
      },
      elements,
      tree,
      type: 'tree',
    });
  };

  return {
    copyAllElements,
    copyElement,
  };
};
