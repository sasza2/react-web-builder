import { useContext } from 'react';
import type { BreakpointsExtras, ElementsInBreakpoints, WebBuilderElements } from 'types';

import { ElementsContext } from '@/components/ElementsProvider';
import { useAppSelector } from '@/store/useAppSelector';

type UseElements = {
  elements: WebBuilderElements,
  elementsInBreakpoints: ElementsInBreakpoints,
  elementsExtras: React.MutableRefObject<BreakpointsExtras>,
};

export const useElements = (): UseElements => {
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elements, elementsExtras } = useContext(ElementsContext);

  return {
    elements,
    elementsInBreakpoints,
    elementsExtras,
  };
};
