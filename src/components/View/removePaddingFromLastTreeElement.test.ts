import type { Tree } from "types";
import { expect, it } from "vitest";

import { removePaddingFromLastTreeElement } from "./removePaddingFromLastTreeElement";

it("sets paddingBottom to 0 on a leaf component node", () => {
	const tree = {
		type: "component",
		paddingBottom: 20,
	} as unknown as Tree;

	removePaddingFromLastTreeElement(tree);

	expect((tree as unknown as { paddingBottom: number }).paddingBottom).toBe(0);
});

it("does nothing to a non-component node without children", () => {
	const tree = { type: "row" } as unknown as Tree;

	removePaddingFromLastTreeElement(tree);

	expect("paddingBottom" in (tree as unknown as Record<string, unknown>)).toBe(
		false,
	);
});

it("recurses into the last child only", () => {
	const firstChild = {
		type: "component",
		paddingBottom: 5,
	} as unknown as Tree;
	const lastChild = {
		type: "component",
		paddingBottom: 10,
	} as unknown as Tree;
	const tree = {
		type: "row",
		children: [firstChild, lastChild],
	} as unknown as Tree;

	removePaddingFromLastTreeElement(tree);

	expect(
		(firstChild as unknown as { paddingBottom: number }).paddingBottom,
	).toBe(5);
	expect(
		(lastChild as unknown as { paddingBottom: number }).paddingBottom,
	).toBe(0);
});

it("recurses through nested trees to reach the deepest last element", () => {
	const deepest = {
		type: "component",
		paddingBottom: 99,
	} as unknown as Tree;
	const middle = {
		type: "row",
		children: [deepest],
	} as unknown as Tree;
	const tree = {
		type: "row",
		children: [middle],
	} as unknown as Tree;

	removePaddingFromLastTreeElement(tree);

	expect((deepest as unknown as { paddingBottom: number }).paddingBottom).toBe(
		0,
	);
});
