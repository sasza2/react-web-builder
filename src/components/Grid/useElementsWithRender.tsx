import { useMemo, useRef } from 'react';
import { GridElement } from 'react-grid-panzoom';
import { ElementId, ElementRenderFunc } from 'types';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useElements } from '@/hooks/useElements';
import { useSelectedElementId } from '@/hooks/useSelectedElementId';
import { produceRenderForElement } from '@/utils/element';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useElementsCache } from '@/hooks/useElementsCache';
import { useSelectedElements } from '@/hooks/useSelectedElements';

const useElementsWithRender = () => {
  const breakpoint = useBreakpoint();
  const { components, transformElementProperty } = useWebBuilderProperties();
  const { elements } = useElements();
  const cache = useElementsCache();
  const [selectedElementId] = useSelectedElementId();
  if (selectedElementId) cache.remove(selectedElementId);
  const { selectedElements } = useSelectedElements();

  const sortIndexes = useRef<Map<ElementId, number>>();
  if (!sortIndexes.current) sortIndexes.current = new Map();

  const lastSortIndex = useRef(0);

  return useMemo(() => {
    // Keep order for react
    const nextSortIndexes = new Map<ElementId, number>();

    elements.forEach((element) => {
      if (sortIndexes.current.get(element.id)) {
        nextSortIndexes.set(element.id, sortIndexes.current.get(element.id));
      } else {
        nextSortIndexes.set(element.id, lastSortIndex.current);
        lastSortIndex.current++;
      }
    });

    sortIndexes.current = nextSortIndexes;

    const elementsWithRender = [...elements]
      .sort((a, b) => nextSortIndexes.get(a.id) - nextSortIndexes.get(b.id))
      .map((element) => {
        let render: ElementRenderFunc;
        const renderFromCache = cache.get(element.id);

        if (renderFromCache) {
          render = renderFromCache;
        } else {
          const [renderForElement, exists] = produceRenderForElement(
            components,
            breakpoint,
            element,
            transformElementProperty,
          );

          render = renderForElement;
          if (exists) cache.set(element.id, render);
        }

        const isSelected = selectedElements.includes(element.id);

        const elementWithRender = {
          ...element,
          family: isSelected ? 'common' : null,
          fullHeight: true,
          render,
        } as unknown as GridElement;

        return elementWithRender;
      });

    return elementsWithRender;
  }, [breakpoint, components, elements, selectedElements]);
};

export default useElementsWithRender;
