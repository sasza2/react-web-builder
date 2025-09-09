import type { ElementsExtras, WebBuilderElements } from 'types';

const getBreakpointRowsByLastElement = (
  elements: WebBuilderElements,
  extras: ElementsExtras,
): number => {
  let rows = 0;
  elements.forEach((element) => {
    const current = element.y + (extras[element.id]?.height || 0);
    if (current > rows) rows = current;
  });

  return rows;
};

export default getBreakpointRowsByLastElement;
