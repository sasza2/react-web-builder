import { GridAPI } from 'react-grid-panzoom';

import { Breakpoint, ElementsExtras } from 'types';
import { getElementsReference } from '@/components/View/elementsRefMap';

export const getContainerExtras = (container: Breakpoint, gridAPIRef: React.MutableRefObject<GridAPI>): ElementsExtras => {
  const containerExtras: ElementsExtras = {};
  const containerMapRef = getElementsReference(container);
  if (!containerMapRef) return null;

  const zoom = gridAPIRef.current.getPanZoom().getZoom();

  containerMapRef.forEach((elementRef, elementId) => {
    const style = window.getComputedStyle(elementRef);
    const paddingBottom = parseFloat(style.paddingBottom) || 0;
    const heightInPixels = (elementRef.firstChild as HTMLElement).getBoundingClientRect().height;

    containerExtras[elementId] = {
      height: Math.ceil(Math.round(heightInPixels / container.rowHeight / zoom * 10) / 10),
      paddingBottom,
    };
  });

  return containerExtras;
};
