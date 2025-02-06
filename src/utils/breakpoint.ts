import { GridAPI } from 'react-grid-panzoom';
import {
  Breakpoint, BreakpointId, BreakpointsExtras, ElementExtra, ElementsExtras, ElementsInBreakpoints, Page, PageSettings,
  WebBuilderElement,
} from 'types';

import { get } from '@/utils/field';

import { cloneDeep } from './clone';
import { createUniqueId } from './createUniqueId';
import { getElementContainerIdProp } from './element';

export const getBreakpointBackgroundColor = (breakpoint: Breakpoint, pageSettings: PageSettings) => breakpoint.backgroundColor || pageSettings.backgroundColor;

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

export const isBreakpoint = (breakpoint: Breakpoint) => !breakpoint.parentId;

export const isContainer = (breakpoint: Breakpoint) => !isBreakpoint(breakpoint);

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

export type ElementsTreeInBreakpoint = {
  children?: ElementsTreeInBreakpoint[],
  container?: Breakpoint,
  element: WebBuilderElement,
};

export const createTreeFromBreakpoint = ({
  allBreakpoints,
  elementsInBreakpoints,
  selectedElements,
  currentBreakpoint,
  elementsExtras,
  rewriteContainersIds,
}: {
  allBreakpoints: Breakpoint[],
  elementsInBreakpoints: ElementsInBreakpoints,
  selectedElements: WebBuilderElement[],
  currentBreakpoint: Breakpoint,
  elementsExtras: ElementsExtras,
  rewriteContainersIds: boolean,
}): ElementsTreeInBreakpoint[] => {
  const treeList: ElementsTreeInBreakpoint[] = [];

  selectedElements.forEach((element) => {
    const copyElement = cloneDeep(element);

    if (element.componentName === 'Container') {
      const containerIdProp = getElementContainerIdProp(copyElement.props);
      const container = allBreakpoints.find((item) => item.id === containerIdProp.value);

      if (!container) {
        treeList.push({
          element: copyElement,
        });

        return;
      }

      const copyContainerIdPropValue = rewriteContainersIds ? createUniqueId() : container.id;

      if (rewriteContainersIds) {
        elementsExtras[copyContainerIdPropValue] = {
          ...elementsExtras[container.id],
        };
      }

      const nextContainer = rewriteContainersIds ? {
        ...container,
        id: copyContainerIdPropValue,
        parentId: currentBreakpoint.id,
      } : container;

      const children = createTreeFromBreakpoint({
        allBreakpoints,
        elementsInBreakpoints,
        selectedElements: elementsInBreakpoints[containerIdProp.value as string],
        currentBreakpoint: nextContainer,
        elementsExtras,
        rewriteContainersIds,
      });

      copyElement.breakpointId = container.id;

      treeList.push({
        children,
        container: nextContainer,
        element: copyElement,
      });

      if (rewriteContainersIds) {
        containerIdProp.value = copyContainerIdPropValue;
      }

      return;
    }

    copyElement.breakpointId = currentBreakpoint.id;

    treeList.push({
      element: copyElement,
    });
  });

  return treeList;
};

export const byBreakpointId = (id: BreakpointId) => (breakpoint: Breakpoint) => breakpoint.id === id;
