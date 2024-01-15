import { GridAPI } from 'react-grid-panzoom';

import {
  Breakpoint, BreakpointsExtras, ElementExtra, ElementsExtras, Page, PageSettings,
} from 'types';
import { get } from '@/utils/field';

export const getBreakpointBackgroundColor = (breakpoint: Breakpoint, page: PageSettings) => breakpoint.backgroundColor || page.backgroundColor;

export const getBreakpointPadding = (breakpoint: Breakpoint) => {
  if (!breakpoint.padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    };
  }

  return {
    top: breakpoint.padding.top || 0,
    right: breakpoint.padding.right || 0,
    bottom: breakpoint.padding.bottom || 0,
    left: breakpoint.padding.left || 0,
  };
};

export const shouldLoadTemplateForBreakpoint = (
  page: Page,
  breakpoint: Breakpoint,
) => {
  if (!page) return false;
  if (!breakpoint || !breakpoint.template) return false;

  const elementsExtrasIds = Object.keys(get(page, `elementsExtras.${breakpoint.id}`, {}));

  return !elementsExtrasIds.length;
};

export const shouldLoadTemplate = (page: Page) => {
  if (!page || !Array.isArray(page.breakpoints)) return false;
  return page.breakpoints.some((breakpoint) => shouldLoadTemplateForBreakpoint(page, breakpoint));
};

export const assignToElementsExtras = (
  elementsExtras: React.MutableRefObject<BreakpointsExtras>,
  breakpoint: Breakpoint,
  elementsMap: Record<string | number, unknown>,
  prop: keyof ElementExtra,
) => {
  Object.entries(elementsMap).forEach(([id, value]) => {
    const element = elementsExtras.current[breakpoint.id][id];
    if (element) {
      element[prop] = value as typeof element[typeof prop];
    } else {
      elementsExtras.current[breakpoint.id][id] = {
        [prop]: value,
      };
    }
  });
};

export const assignAllToElementsExtras = (
  elementsExtras: React.MutableRefObject<BreakpointsExtras>,
  breakpoint: Breakpoint,
  gridAPI: React.MutableRefObject<GridAPI>,
) => {
  if (!gridAPI.current) return;

  const elementsHeight = gridAPI.current.measureElementsHeight();
  assignToElementsExtras(elementsExtras, breakpoint, elementsHeight, 'height');
  const elementsPaddingBottom = gridAPI.current.getElementsPaddingBottom();
  assignToElementsExtras(elementsExtras, breakpoint, elementsPaddingBottom, 'paddingBottom');
};

export const initElementsExtrasFromBreakpoint = (
  page: Page,
  breakpoint: Breakpoint,
  elementsExtras: React.MutableRefObject<ElementsExtras>,
) => {
  if (breakpoint && !elementsExtras.current[breakpoint.id]) {
    elementsExtras.current[breakpoint.id] = page?.elementsExtras?.[breakpoint.id] || {};
  }
};
