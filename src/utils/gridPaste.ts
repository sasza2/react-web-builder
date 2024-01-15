import { Breakpoint, Tree, WebBuilderElement } from 'types';
import { createUniqueId } from './createUniqueId';

type PasteElement = (props: {
  element: WebBuilderElement,
  breakpoint: Breakpoint,
  clipboardBreakpoint: { cols: number },
  x: number,
  y: number,
}) => WebBuilderElement;

export const pasteElement: PasteElement = ({
  element,
  breakpoint,
  clipboardBreakpoint,
  x,
  y,
}) => {
  const id = createUniqueId();

  let w = breakpoint.cols;
  let col = 0;

  if (clipboardBreakpoint.cols === breakpoint.cols) {
    col = Math.min(x, clipboardBreakpoint.cols - element.w);
    w = element.w;
  }

  return {
    ...element,
    id,
    w,
    h: 'auto',
    x: col,
    y,
  };
};

export const treeToElements = (tree: Tree, columns: number, currentY: number): [WebBuilderElement[], number] => {
  if (tree.element) {
    const nextY = tree.marginTop + currentY;
    return [
      [
        {
          ...tree.element,
          id: createUniqueId(),
          x: 0,
          w: columns,
          y: nextY,
        },
      ],
      nextY + tree.marginBottom,
    ];
  }

  const allElements: WebBuilderElement[] = [];

  let nextY = currentY + tree.marginTop;

  tree.children.forEach((child) => {
    const [elements, tmpY] = treeToElements(child, columns, nextY);
    if (tmpY === nextY) {
      nextY += 1;
    } else {
      nextY = tmpY;
    }
    allElements.push(...elements);
  });

  nextY += tree.marginBottom;

  return [allElements, nextY];
};

type PasteElements = (props: {
  elements: WebBuilderElement[],
  breakpoint: Breakpoint,
  clipboardBreakpoint: { cols: number },
  tree: Tree,
  y: number,
}) => WebBuilderElement[];

export const pasteElements: PasteElements = ({
  elements,
  breakpoint,
  clipboardBreakpoint,
  tree,
  y,
}) => {
  if (clipboardBreakpoint.cols === breakpoint.cols) {
    return elements.map((element) => ({
      ...element,
      id: createUniqueId(),
      y: element.y + y,
      x: element.x,
    }));
  }

  tree.marginTop = 0;

  const [elementsFromTree] = treeToElements(tree, breakpoint.cols, 0);
  if (!elementsFromTree.length) return [];

  const [firstElementFromTree] = elementsFromTree;
  const marginTop = y - firstElementFromTree.y;

  elementsFromTree.forEach((element) => {
    element.y += marginTop;
  });

  return elementsFromTree;
};
