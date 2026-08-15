import type { WebBuilderElements } from "types";
import { expect, it } from "vitest";

import substractMarginFromElements from "./substractMarginFromElements";

it("subtracts marginLeft/marginTop from every element's x/y", () => {
	const elements = [
		{ id: "1", x: 10, y: 20 },
		{ id: "2", x: 5, y: 3 },
	] as unknown as WebBuilderElements;

	const result = substractMarginFromElements(elements, 2, 1);

	expect(result).toEqual([
		{ id: "1", x: 8, y: 19 },
		{ id: "2", x: 3, y: 2 },
	]);
});

it("returns a new array without mutating the original elements", () => {
	const elements = [{ id: "1", x: 10, y: 20 }] as unknown as WebBuilderElements;

	const result = substractMarginFromElements(elements, 0, 0);

	expect(result).not.toBe(elements);
	expect(result[0]).not.toBe(elements[0]);
	expect(elements[0].x).toBe(10);
});

it("returns an empty array for an empty input", () => {
	expect(substractMarginFromElements([], 5, 5)).toEqual([]);
});
