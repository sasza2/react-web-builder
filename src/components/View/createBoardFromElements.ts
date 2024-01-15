import { WebBuilderElement, WebBuilderElements, ElementsExtras } from 'types';

type ElementWithHeiht = WebBuilderElement & {
  h: 'auto' | number,
};

type CreateBoardFromElements = (
  elements: WebBuilderElements,
  elementsExtras: ElementsExtras,
) => {
  boardByRows: Array<WebBuilderElements>,
  boardByColumns: Array<WebBuilderElements>,
};

const createBoardFromElements: CreateBoardFromElements = (
  elements,
  elementsExtras,
) => {
  const boardByRows: Array<WebBuilderElements> = [];
  const boardByColumns: Array<WebBuilderElements> = [];
  let columns = 0;
  let rows = 0;

  elements.forEach((element: ElementWithHeiht) => {
    const maxX = element.x + element.w;
    const heightFromExtras = elementsExtras[element.id]?.height || 1; // TODO
    const height = (element.h === 'auto' ? heightFromExtras : element.h) || heightFromExtras;
    const maxY = element.y + height;

    if (maxX > columns) columns = maxX;
    if (maxY > rows) rows = maxY;

    for (let { x } = element; x < maxX; x++) {
      for (let { y } = element; y < maxY; y++) {
        if (!boardByRows[y]) boardByRows[y] = [];
        if (!boardByColumns[x]) boardByColumns[x] = [];

        boardByColumns[x][y] = element;
        boardByRows[y][x] = element;
      }
    }
  });

  return {
    boardByRows,
    boardByColumns,
  };
};

export default createBoardFromElements;
