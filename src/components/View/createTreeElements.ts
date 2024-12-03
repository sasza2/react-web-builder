import { ElementsExtras, Tree, WebBuilderElements } from 'types';

import { createUniqueId } from '@/utils/createUniqueId';

import createBoardFromElements from './createBoardFromElements';
import cutBoard from './cutBoard';
import getElementsFromBoard from './getElementsFromBoard';
import splitBoard from './splitBoard';
import splitBoardBySeparators from './splitBoardBySeparators';
import substractMarginFromElements from './substractMarginFromElements';

const calcMargin = (elements: Array<WebBuilderElements>): number => {
  for (let i = 0; i < elements.length; i++) {
    const line = elements[i];
    if (!line) continue;
    for (let c = 0; c < line.length; c++) {
      if (line[c]) return i;
    }
  }
  return elements.length;
};

const createTreeElements = (
  elements: WebBuilderElements,
  elementsExtras: ElementsExtras,
  columns: number,
  rows: number,
): Tree => {
  const createFromRow = (
    boardByRows: WebBuilderElements[],
    rowLines: Array<[number, number]>,
    substractSeparators: boolean,
  ): Tree => {
    const children = [];

    for (let i = 0; i < rowLines.length; i++) {
      const [from, to] = rowLines[i];

      const childElementsBefore = getElementsFromBoard(
        cutBoard(boardByRows, { from, to }),
      );

      const fromToRemove = substractSeparators ? from + i : from;
      const childElements = substractMarginFromElements(childElementsBefore, 0, fromToRemove);

      if (!childElements.length) continue;
      if (elements.length === childElements.length) continue;

      const child = createTreeElements(
        childElements,
        elementsExtras,
        columns,
        to - from + 1,
      );

      if (!children.length) {
        child.marginTop = calcMargin(boardByRows);
      }

      const nextRowLine = rowLines[i + 1];
      if (nextRowLine) {
        const [fromNext] = nextRowLine;
        child.marginBottom = fromNext - (from + child.h);
      }

      children.push(child);
    }

    if (children.length) {
      return {
        id: createUniqueId(),
        children,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        marginBottom: 0,
        type: 'row',
        w: columns,
        h: rows,
      };
    }
  };

  if (elements.length > 1) {
    const {
      boardByColumns, boardByRows,
    } = createBoardFromElements(elements, elementsExtras);

    const separatorsLines = splitBoardBySeparators(boardByRows, rows);
    if (separatorsLines.length > 1) {
      const children = createFromRow(boardByRows, separatorsLines, true);
      if (children) return children;
    }

    const verticalLines = splitBoard(boardByColumns, columns);
    if (verticalLines.length) {
      const children = [];

      for (let i = 0; i < verticalLines.length; i++) {
        const [from, to] = verticalLines[i];
        const childElementsBefore = getElementsFromBoard(
          cutBoard(boardByColumns, { from, to }),
        );

        const childElements = substractMarginFromElements(childElementsBefore, from, 0);

        if (!childElements.length) continue;
        if (elements.length === childElements.length) continue;

        const child = createTreeElements(
          childElements,
          elementsExtras,
          to - from + 1,
          rows,
        );

        if (!children.length) {
          child.marginLeft = calcMargin(boardByColumns);
        }

        const nextVerticalLine = verticalLines[i + 1];
        if (nextVerticalLine) {
          const [fromNext] = nextVerticalLine;
          child.marginRight = fromNext - (from + child.w);
        }

        children.push(child);
      }

      if (children.length) {
        return {
          id: createUniqueId(),
          children,
          marginLeft: 0,
          marginRight: 0,
          marginTop: 0,
          marginBottom: 0,
          type: 'column',
          w: columns,
          h: rows,
        };
      }
    }

    const rowLines = splitBoard(boardByRows, rows);
    if (rowLines.length) {
      const children = createFromRow(boardByRows, rowLines, false);
      if (children) return children;
    }
  }

  if (elements.length > 1) {
    return {
      id: createUniqueId(),
      children: elements.map((element) => ({
        id: createUniqueId(),
        marginLeft: element.x,
        marginTop: element.y,
        marginRight: 0,
        marginBottom: 0,
        paddingBottom: elementsExtras[element.id]?.paddingBottom || 0,
        element,
        type: 'component',
        w: element.w,
        h: elementsExtras[element.id]?.height,
      })),
      marginLeft: 0,
      marginTop: 0,
      marginRight: 0,
      marginBottom: 0,
      type: 'fixed',
      w: columns,
      h: rows,
    };
  }

  const element = elements[0];
  if (!element) {
    return {
      id: createUniqueId(),
      children: [],
      marginLeft: 0,
      marginRight: 0,
      marginTop: 0,
      marginBottom: 0,
      type: 'row',
      w: columns,
      h: rows,
    };
  }

  const h = elementsExtras[element.id]?.height;
  return {
    id: createUniqueId(),
    marginLeft: element.x,
    marginTop: element.y,
    marginRight: 0,
    marginBottom: 0,
    paddingBottom: elementsExtras[element.id]?.paddingBottom || 0,
    element,
    type: 'component',
    w: element.w,
    h,
  };
};

export default createTreeElements;
