import type { Tree } from "types";
import { expect, it } from "vitest";

import { doesTreeContainElements } from "./doesTreeContainElements";

it("returns false for a falsy tree", () => {
	expect(doesTreeContainElements(null as unknown as Tree)).toBe(false);
	expect(doesTreeContainElements(undefined as unknown as Tree)).toBe(false);
});

it("returns true for a component node", () => {
	expect(
		doesTreeContainElements({ type: "component" } as unknown as Tree),
	).toBe(true);
});

it("returns true when a row/column node has children", () => {
	expect(
		doesTreeContainElements({
			type: "row",
			children: [{ type: "component" }],
		} as unknown as Tree),
	).toBe(true);
});

it("returns false when a row/column node has no children", () => {
	expect(
		doesTreeContainElements({ type: "row", children: [] } as unknown as Tree),
	).toBe(false);
	expect(doesTreeContainElements({ type: "row" } as unknown as Tree)).toBe(
		false,
	);
});
