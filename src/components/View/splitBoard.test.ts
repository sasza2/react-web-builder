import { WebBuilderElement, WebBuilderElements } from 'types';
import { expect, it } from 'vitest';

import splitBoard from './splitBoard';

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

it('splitBoard', () => {
  expect(splitBoard(createColumnsFromBoard([
    ['=', '=', '=', ' ', ' ', ' '],
    ['=', '=', '=', ' ', ' ', 'X'],
  ]), 6)).toStrictEqual([[0, 2], [5, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    ['=', '=', '=', 'Y', 'Y', ' '],
    ['=', '=', '=', ' ', ' ', 'X'],
  ]), 6)).toStrictEqual([[0, 2], [3, 4], [5, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    ['=', ' ', 'W', ' ', 'Y', ' '],
    ['=', ' ', 'W', ' ', ' ', 'X'],
    ['=', ' ', 'W', ' ', ' ', 'X'],
    ['=', 'O', 'O', 'O', ' ', 'X'],
  ]), 6)).toStrictEqual([[0, 0], [1, 3], [4, 4], [5, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    ['=', ' ', 'W', ' ', 'Y', 'Y'],
    ['=', ' ', 'W', ' ', ' ', 'X'],
    ['=', ' ', 'W', ' ', ' ', 'X'],
    ['=', 'O', 'O', 'O', ' ', 'X'],
  ]), 6)).toStrictEqual([[0, 0], [1, 3], [4, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    [' ', ' ', 'W', ' ', 'Y', 'Y'],
    [' ', ' ', 'W', ' ', ' ', 'X'],
    [' ', ' ', 'W', ' ', ' ', 'X'],
    [' ', ' ', 'O', 'O', ' ', 'X'],
  ]), 6)).toStrictEqual([[2, 3], [4, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    ['W', 'W', 'W', 'W', 'W', 'W'],
    [' ', ' ', 'U', ' ', ' ', 'X'],
    [' ', ' ', 'U', ' ', ' ', 'X'],
    [' ', ' ', 'O', 'O', ' ', 'X'],
  ]), 6)).toStrictEqual([]);

  expect(splitBoard(createColumnsFromBoard([
    ['W', 'W', 'U', 'U', 'Z', 'Z'],
    [' ', ' ', 'U', 'U', ' ', 'X'],
    [' ', ' ', 'U', 'U', ' ', 'X'],
    [' ', ' ', 'U', 'U', ' ', 'X'],
  ]), 6)).toStrictEqual([[0, 1], [2, 3], [4, 5]]);

  expect(splitBoard(createColumnsFromBoard([
    ['1', '1', '1', '2', '2'],
    ['1', '1', '1', ' ', ' '],
  ]), 5)).toStrictEqual([[0, 2], [3, 4]]);

  expect(splitBoard(createColumnsFromBoard([
    [' ', 'X', 'X', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' '],
  ]), 5)).toStrictEqual([]);

  expect(splitBoard(createColumnsFromBoard([
    ['T', 'T', 'T', 'T', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', 'W', 'W', 'W', 'W', 'W'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', 'X', 'X', 'X'],
  ]), 10)).toStrictEqual([[0, 3], [5, 9]]);
});
