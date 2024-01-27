import React, {
  createContext, useMemo, useRef,
} from 'react';

import {
  BreakpointsExtras, ElementId, ElementRenderFunc, WebBuilderElements,
} from 'types';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useAppSelector } from '@/store/useAppSelector';
import { initElementsExtrasFromBreakpoint } from '@/utils/breakpoint';

type IElementsContext = {
  elements: WebBuilderElements,
  elementsCache: React.MutableRefObject<Map<ElementId, ElementRenderFunc>>,
  elementsExtras: React.MutableRefObject<BreakpointsExtras>,
};

const EMPTY_ELEMENTS: WebBuilderElements = [];

export const ElementsContext = createContext<IElementsContext>({} as IElementsContext);

export function ElementsProvider({ children }: React.PropsWithChildren) {
  const { page } = useWebBuilderProperties();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const breakpoint = useBreakpoint();

  const elementsCache = useRef<Map<ElementId, ElementRenderFunc>>();
  if (!elementsCache.current) {
    elementsCache.current = new Map<ElementId, ElementRenderFunc>();
  }

  const elementsExtras = useRef<BreakpointsExtras>();
  if (!elementsExtras.current) elementsExtras.current = { ...page?.elementsExtras };

  initElementsExtrasFromBreakpoint(page, breakpoint, elementsExtras);

  const elements = elementsInBreakpoints[breakpoint?.id] || EMPTY_ELEMENTS;

  const value = useMemo(() => ({
    elements, elementsCache, elementsExtras,
  }), [elements, elementsCache, elementsExtras]);

  return (
    <ElementsContext.Provider value={value}>
      {children}
    </ElementsContext.Provider>
  );
}
