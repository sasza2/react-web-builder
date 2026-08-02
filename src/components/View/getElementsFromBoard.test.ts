import type { WebBuilderElements } from "types";
import { expect, it } from "vitest";

import getElementsFromBoard from "./getElementsFromBoard";

it("returns an empty array for an empty board", () => {
	expect(getElementsFromBoard([])).toEqual([]);
});

it("deduplicates elements that appear multiple times in the board", () => {
	const elementA = { id: "1" };
	const elementB = { id: "2" };
	const board = [
		[elementA, elementA, elementB],
		[elementA, elementB, elementB],
	] as unknown as Array<WebBuilderElements>;

	const result = getElementsFromBoard(board);

	expect(result).toHaveLength(2);
	expect(result).toEqual(expect.arrayContaining([elementA, elementB]));
});

it("skips empty/falsy cells in the board", () => {
	const elementA = { id: "1" };
	const board = [
		[elementA, undefined],
		[null, elementA],
	] as unknown as Array<WebBuilderElements>;

	expect(getElementsFromBoard(board)).toEqual([elementA]);
});
