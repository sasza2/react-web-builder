import type { Tree } from "types";
import { describe, expect, it } from "vitest";

import { calculatePositionsOfElements, getElementsFromTree } from "./templates";

const componentTree = (id: string, overrides = {}): Tree =>
	({
		id,
		type: "component",
		h: 0,
		marginBottom: 0,
		marginLeft: 0,
		marginRight: 0,
		marginTop: 0,
		w: 1,
		element: { id, x: 0, y: 0, w: 1, h: 0, ...overrides },
	}) as unknown as Tree;

describe("getElementsFromTree", () => {
	it("returns the element for a component tree", () => {
		const tree = componentTree("a");
		expect(getElementsFromTree(tree)).toEqual([tree.element]);
	});

	it("collects elements from a row tree", () => {
		const tree = {
			type: "row",
			children: [componentTree("a"), componentTree("b")],
		} as unknown as Tree;

		expect(getElementsFromTree(tree).map((el) => el.id)).toEqual(["a", "b"]);
	});

	it("collects elements from a column tree", () => {
		const tree = {
			type: "column",
			children: [componentTree("a")],
		} as unknown as Tree;

		expect(getElementsFromTree(tree).map((el) => el.id)).toEqual(["a"]);
	});

	it("collects elements from a fixed tree", () => {
		const tree = {
			type: "fixed",
			children: [componentTree("a")],
		} as unknown as Tree;

		expect(getElementsFromTree(tree).map((el) => el.id)).toEqual(["a"]);
	});

	it("throws for an unknown tree type", () => {
		const tree = { type: "unknown" } as unknown as Tree;
		expect(() => getElementsFromTree(tree)).toThrow("undefined tree type");
	});
});

describe("calculatePositionsOfElements", () => {
	const measureHeight = () => 2;

	it("positions elements in a row", () => {
		const tree = {
			id: "root",
			type: "row",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			w: 2,
			children: [componentTree("a"), componentTree("b")],
		} as unknown as Tree;

		const elements = calculatePositionsOfElements(tree, measureHeight);

		expect(elements).toHaveLength(2);
		expect(elements[0]).toMatchObject({ id: "a", x: 0, y: 0 });
		expect(elements[1]).toMatchObject({ id: "b", x: 0, y: 2 });
	});

	it("positions elements in a column", () => {
		const tree = {
			id: "root",
			type: "column",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			w: 2,
			children: [componentTree("a", { w: 1 }), componentTree("b", { w: 1 })],
		} as unknown as Tree;

		const elements = calculatePositionsOfElements(tree, measureHeight);

		expect(elements[0]).toMatchObject({ id: "a", x: 0 });
		expect(elements[1]).toMatchObject({ id: "b", x: 1 });
	});

	it("positions elements in a fixed tree", () => {
		const tree = {
			id: "root",
			type: "fixed",
			h: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			marginTop: 0,
			w: 2,
			children: [componentTree("a")],
		} as unknown as Tree;

		const elements = calculatePositionsOfElements(tree, measureHeight);

		expect(elements[0]).toMatchObject({ id: "a" });
	});

	it("throws for an unknown tree type", () => {
		const tree = { type: "unknown" } as unknown as Tree;
		expect(() => calculatePositionsOfElements(tree, measureHeight)).toThrow(
			"undefined tree type",
		);
	});
});
