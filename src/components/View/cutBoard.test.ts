import type { WebBuilderElement, WebBuilderElements } from 'types';
import { expect, it } from 'vitest';

import cutBoard from './cutBoard';

// TODO - to helpers
const createColumnsFromBoard = (board: Array<Array<string>>): WebBuilderElements[] => {
  const elementsMap: Record<string, WebBuilderElement> = {};
  const columns: WebBuilderElements[] = board[0].map(() => [] as WebBuilderElements);
  board.forEach((row, rowIndex) => {
    row.forEach((elementId, columnIndex) => {
      if (elementId === ' ') return;

      if (!elementsMap[elementId]) {
        elementsMap[elementId] = { id: elementId } as WebBuilderElement;
      }
      columns[columnIndex][rowIndex] = elementsMap[elementId];
    });
  });
  return columns;
};

it('cutBoard', () => {
  expect(cutBoard(createColumnsFromBoard([
    ['=', '=', '=', ' ', ' ', ' '],
    ['=', '=', '=', ' ', ' ', 'X'],
  ]), {
    from: 0,
    to: 1,
  })).toStrictEqual(createColumnsFromBoard([
    ['=', '='],
    ['=', '='],
  ]));

  expect(cutBoard(createColumnsFromBoard([
    ['=', '=', '=', 'W', ' ', ' '],
    ['=', '=', '=', 'W', ' ', 'X'],
    [' ', ' ', ' ', 'W', ' ', 'X'],
  ]), {
    from: 3,
    to: 3,
  })).toStrictEqual(createColumnsFromBoard([
    ['W'],
    ['W'],
    ['W'],
  ]));

  expect(cutBoard(createColumnsFromBoard([
    ['=', '=', '=', 'W', ' ', ' '],
    ['=', '=', '=', 'W', ' ', 'X'],
    [' ', ' ', ' ', 'W', ' ', 'X'],
  ]), {
    from: 0,
    to: 2,
  })).toStrictEqual(createColumnsFromBoard([
    ['=', '=', '='],
    ['=', '=', '='],
  ]));
});
