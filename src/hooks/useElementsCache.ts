import {
  useContext, useEffect, useMemo, useRef,
} from 'react';

import { ElementId, ElementRenderFunc } from 'types';
import { ElementsContext } from '@/components/ElementsProvider';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useElements } from './useElements';
import { useBreakpoint } from './useBreakpoint';

type CacheRecord = {
  remove: (id: ElementId) => void,
  get: (id: ElementId) => ElementRenderFunc,
  set: (id: ElementId, renderFunc: ElementRenderFunc) => void,
};

export const useElementsCache = (): CacheRecord => {
  const { elementsCache } = useContext(ElementsContext);
  const { elements } = useElements();
  const breakpoint = useBreakpoint();
  const { defaultButtonBackgroundColor } = useWebBuilderProperties();
  const breakpointId = useRef<string>();
  breakpointId.current = breakpoint.id;

  const produceCacheId = (elementId: ElementId) => `${breakpointId.current}-${elementId}`;

  useMemo(() => {
    elementsCache.current.clear();
  }, [defaultButtonBackgroundColor]);

  useEffect(() => {
    if (!breakpoint) return;

    const nextCache = new Map<ElementId, ElementRenderFunc>();
    elements.forEach((element) => {
      const cacheId = produceCacheId(element.id);
      const renderFunction = elementsCache.current.get(cacheId);
      if (renderFunction) {
        nextCache.set(cacheId, renderFunction);
      }
    });
    elementsCache.current = nextCache;
  }, [breakpoint?.id, elements]);

  const actions = useMemo(() => ({
    remove: (id: ElementId) => {
      elementsCache.current.delete(produceCacheId(id));
    },
    get: (id: ElementId) => elementsCache.current.get(produceCacheId(id)),
    set: (id: ElementId, renderFunction: ElementRenderFunc) => {
      elementsCache.current.set(produceCacheId(id), renderFunction);
    },
  }), []);

  return actions;
};
