import type { ElementsExtras, WebBuilderElements } from "types";
import { expect, it } from "vitest";

import createBoardFromElements from "./createBoardFromElements";

it("returns empty boards for an empty elements list", () => {
	const result = createBoardFromElements([], {});
	expect(result.boardByRows).toEqual([]);
	expect(result.boardByColumns).toEqual([]);
});

it("places a fixed-height element into both board representations", () => {
	const element = { id: "1", x: 0, y: 0, w: 2, h: 2 };
	const elements = [element] as unknown as WebBuilderElements;

	const { boardByRows, boardByColumns } = createBoardFromElements(elements, {});

	expect(boardByRows[0][0]).toBe(element);
	expect(boardByRows[1][1]).toBe(element);
	expect(boardByColumns[0][0]).toBe(element);
	expect(boardByColumns[1][1]).toBe(element);
});

it("uses the extras height when h is 'auto'", () => {
	const element = { id: "1", x: 0, y: 0, w: 1, h: "auto" };
	const elements = [element] as unknown as WebBuilderElements;
	const extras = { "1": { height: 3 } } as unknown as ElementsExtras;

	const { boardByRows } = createBoardFromElements(elements, extras);

	expect(boardByRows).toHaveLength(3);
	expect(boardByRows[0][0]).toBe(element);
	expect(boardByRows[2][0]).toBe(element);
});

it("falls back to extras height of 1 when there is no extras entry for 'auto' height", () => {
	const element = { id: "1", x: 0, y: 0, w: 1, h: "auto" };
	const elements = [element] as unknown as WebBuilderElements;

	const { boardByRows } = createBoardFromElements(elements, {});

	expect(boardByRows).toHaveLength(1);
});

it("falls back to extras height when h is 0/falsy but not 'auto'", () => {
	const element = { id: "1", x: 0, y: 0, w: 1, h: 0 };
	const elements = [element] as unknown as WebBuilderElements;
	const extras = { "1": { height: 4 } } as unknown as ElementsExtras;

	const { boardByRows } = createBoardFromElements(elements, extras);

	expect(boardByRows).toHaveLength(4);
});

it("tracks the maximum columns/rows across multiple elements", () => {
	const elementA = { id: "1", x: 0, y: 0, w: 2, h: 1 };
	const elementB = { id: "2", x: 3, y: 4, w: 1, h: 1 };
	const elements = [elementA, elementB] as unknown as WebBuilderElements;

	const { boardByRows, boardByColumns } = createBoardFromElements(elements, {});

	expect(boardByRows).toHaveLength(5);
	expect(boardByColumns).toHaveLength(4);
	expect(boardByRows[4][3]).toBe(elementB);
});
