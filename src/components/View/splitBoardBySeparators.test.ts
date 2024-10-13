import { WebBuilderElement, WebBuilderElements } from 'types';
import { expect, it } from 'vitest';

import splitBoardBySeparators from './splitBoardBySeparators';

// TODO - to helpers
const createColumnsFromBoard = (board: Array<Array<string>>): WebBuilderElements[] => {
  const elementsMap: Record<string, WebBuilderElement> = {};
  const columns: WebBuilderElements[] = board[0].map(() => [] as WebBuilderElements);
  board.forEach((row, rowIndex) => {
    row.forEach((elementId, columnIndex) => {
      if (elementId === 'S') elementId = 'Separator'; // TODO
      if (elementId === ' ') return;

      if (!elementsMap[elementId]) {
        elementsMap[elementId] = { componentName: elementId } as WebBuilderElement;
      }
      columns[columnIndex][rowIndex] = elementsMap[elementId];
    });
  });
  return columns;
};

it('splitBoard', () => {
  expect(splitBoardBySeparators(createColumnsFromBoard([
    ['S', ' '],
    ['S', ' '],
  ]), 2)).toStrictEqual([[1, 1]]);

  expect(splitBoardBySeparators(createColumnsFromBoard([
    [' ', 'S'],
    [' ', 'S'],
  ]), 2)).toStrictEqual([[0, 0]]);

  expect(splitBoardBySeparators(createColumnsFromBoard([
    [' ', 'S', ' '],
    [' ', 'S', ' '],
  ]), 3)).toStrictEqual([[0, 0], [2, 2]]);

  expect(splitBoardBySeparators(createColumnsFromBoard([
    [' ', 'S', 'S', ' ', ' '],
    [' ', 'S', 'S', ' ', ' '],
  ]), 5)).toStrictEqual([[0, 0], [3, 4]]);

  expect(splitBoardBySeparators(createColumnsFromBoard([
    ['S', ' ', 'S', 'S', ' ', ' '],
    ['S', ' ', 'S', 'S', ' ', ' '],
  ]), 6)).toStrictEqual([[1, 1], [4, 5]]);
});
