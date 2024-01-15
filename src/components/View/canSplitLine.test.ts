import { expect, it } from 'vitest';

import { WebBuilderElement } from 'types';

import canSplitLine from './canSplitLine';

const ELEMENT_A = { id: '1' } as WebBuilderElement;
const ELEMENT_B = { id: '2' } as WebBuilderElement;
const ELEMENT_C = { id: '3' } as WebBuilderElement;
const ELEMENT_D = { id: '4' } as WebBuilderElement;
const ELEMENT_E = { id: '5' } as WebBuilderElement;
const ELEMENT_F = { id: '6' } as WebBuilderElement;

it('canSplitLine', () => {
  expect(canSplitLine([ELEMENT_A], [ELEMENT_A])).toBe(false);
  expect(canSplitLine([ELEMENT_A], [ELEMENT_B])).toBe(true);
  expect(canSplitLine(
    [ELEMENT_A, ELEMENT_B, ELEMENT_C],
    [ELEMENT_D, ELEMENT_E, ELEMENT_F],
  )).toBe(true);
  expect(canSplitLine(
    [ELEMENT_A, ELEMENT_B, ELEMENT_C],
    [ELEMENT_A, ELEMENT_E, ELEMENT_D],
  )).toBe(false);
  expect(canSplitLine(
    [ELEMENT_A],
    [],
  )).toBe(true);
});
