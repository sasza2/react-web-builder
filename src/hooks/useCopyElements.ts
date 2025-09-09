import type { WebBuilderElements } from 'types';

import createTreeElements from '@/components/View/createTreeElements';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { useAppSelector } from '@/store/useAppSelector';
import { copy } from '@/utils/clipboard';
import { groupElementsById } from '@/utils/element';

import { useBreakpoint } from './useBreakpoint';
import { useElements } from './useElements';
import { useSelectedElements } from './useSelectedElements';

export const useCopyElements = () => {
  const breakpoint = useBreakpoint();
  const { elements } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elementsExtras } = useElements();
  const { selectedElements } = useSelectedElements();

  const copyByList = (elementsInList: WebBuilderElements) => {
    const tree = createTreeElements(
      elementsInList,
      elementsExtras.current[breakpoint.id] || {},
      breakpoint.cols,
      getBreakpointRowsByLastElement(elementsInList, elementsExtras.current[breakpoint.id] || {}),
    );

    copy({
      breakpoint: {
        cols: breakpoint.cols,
      },
      elements: elementsInList,
      tree,
      type: 'tree',
    });
  };

  const copyElement = (elementId: string | number) => {
    const element = elements.find((item) => item.id === elementId);
    if (!element) return;

    const isSelected = selectedElements.some((selectedElementId) => selectedElementId === element.id);
    if (isSelected) {
      const elementsById = groupElementsById(elements);
      copyByList(selectedElements.map((selectedElementId) => elementsById[selectedElementId]).filter(Boolean));
    } else {
      copy({
        breakpoint: {
          cols: breakpoint.cols,
        },
        element,
        type: 'element',
      });
    }
  };

  const copyAllElements = () => {
    const elementsInBreakpoint = elementsInBreakpoints[breakpoint.id] || [];
    copyByList(elementsInBreakpoint);
  };

  return {
    copyAllElements,
    copyElement,
  };
};
