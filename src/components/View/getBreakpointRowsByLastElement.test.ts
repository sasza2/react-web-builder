import type { ElementsExtras, WebBuilderElements } from "types";
import { expect, it } from "vitest";

import getBreakpointRowsByLastElement from "./getBreakpointRowsByLastElement";

it("returns 0 for an empty list of elements", () => {
	expect(getBreakpointRowsByLastElement([], {})).toBe(0);
});

it("returns the max y using extras height when present", () => {
	const elements = [
		{ id: "1", y: 2 },
		{ id: "2", y: 5 },
	] as unknown as WebBuilderElements;
	const extras = {
		"1": { height: 3 },
		"2": { height: 1 },
	} as unknown as ElementsExtras;

	// element 1: 2 + 3 = 5, element 2: 5 + 1 = 6
	expect(getBreakpointRowsByLastElement(elements, extras)).toBe(6);
});

it("does not lower rows when a later element's bottom edge is smaller", () => {
	const elements = [
		{ id: "1", y: 10 },
		{ id: "2", y: 2 },
	] as unknown as WebBuilderElements;

	expect(getBreakpointRowsByLastElement(elements, {})).toBe(10);
});

it("uses 0 as the height fallback when extras entry is missing", () => {
	const elements = [{ id: "1", y: 4 }] as unknown as WebBuilderElements;

	expect(getBreakpointRowsByLastElement(elements, {})).toBe(4);
});
