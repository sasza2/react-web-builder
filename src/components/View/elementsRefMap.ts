import { Breakpoint, WebBuilderElement } from 'types';

const elementsInBreakpointsRefMap = new Map<string, Map<string, HTMLElement>>();

export const addElementReference = (breakpoint: Breakpoint, element: WebBuilderElement, ref: HTMLElement) => {
  let elementsMap = elementsInBreakpointsRefMap.get(breakpoint.id);

  if (!elementsMap) {
    elementsMap = new Map();
    elementsInBreakpointsRefMap.set(breakpoint.id, elementsMap);
  }

  elementsMap.set(element.id, ref);

  return () => {
    elementsMap.delete(element.id);

    if (!elementsMap.size) {
      elementsInBreakpointsRefMap.delete(breakpoint.id);
    }
  };
};

export const getElementsReference = (breakpoint: Breakpoint) => elementsInBreakpointsRefMap.get(breakpoint.id);
