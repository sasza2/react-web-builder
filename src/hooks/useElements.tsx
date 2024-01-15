import { useContext } from 'react';

import { BreakpointsExtras, ElementsInBreakpoints, WebBuilderElements } from 'types';
import { useAppSelector } from '@/store/useAppSelector';
import { ElementsContext } from '@/components/ElementsProvider';

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
