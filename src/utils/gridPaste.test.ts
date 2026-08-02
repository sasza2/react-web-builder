import type { Breakpoint, Tree, WebBuilderElement } from "types";
import { describe, expect, it } from "vitest";

import { pasteElement, pasteElements } from "./gridPaste";

const breakpoint = { cols: 10 } as Breakpoint;

describe("pasteElement", () => {
	it("keeps element width and clamps x when columns match", () => {
		const element = { w: 4, props: [] } as unknown as WebBuilderElement;

		const result = pasteElement({
			element,
			breakpoint,
			clipboardBreakpoint: { cols: 10 },
			x: 20,
			y: 3,
		});

		expect(result.w).toBe(4);
		expect(result.x).toBe(6);
		expect(result.y).toBe(3);
		expect(result.h).toBe("auto");
		expect(result.disabledMove).toBe(false);
	});

	it("uses full breakpoint width when columns differ", () => {
		const element = { w: 4, props: [] } as unknown as WebBuilderElement;

		const result = pasteElement({
			element,
			breakpoint,
			clipboardBreakpoint: { cols: 5 },
			x: 2,
			y: 0,
		});

		expect(result.w).toBe(10);
		expect(result.x).toBe(0);
	});
});

describe("pasteElements", () => {
	it("shifts elements by y offset when columns match", () => {
		const elements = [
			{ id: "1", x: 0, y: 2, props: [] },
			{ id: "2", x: 1, y: 4, props: [] },
		] as unknown as WebBuilderElement[];

		const result = pasteElements({
			elements,
			breakpoint,
			clipboardBreakpoint: { cols: 10 },
			tree: {} as Tree,
			y: 10,
		});

		expect(result[0].y).toBe(10);
		expect(result[1].y).toBe(12);
	});

	it("builds elements from tree when columns differ", () => {
		const tree: Tree = {
			id: "root",
			type: "row",
			marginTop: 5,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			w: 5,
			h: 0,
			children: [
				{
					id: "child",
					type: "component",
					marginTop: 0,
					marginBottom: 0,
					marginLeft: 0,
					marginRight: 0,
					w: 5,
					h: 0,
					element: {
						id: "el-1",
						componentName: "Text",
						props: [],
					} as unknown as WebBuilderElement,
				},
			],
		} as unknown as Tree;

		const result = pasteElements({
			elements: [],
			breakpoint,
			clipboardBreakpoint: { cols: 5 },
			tree,
			y: 3,
		});

		expect(result).toHaveLength(1);
		expect(result[0].y).toBe(3);
		expect(result[0].w).toBe(10);
	});

	it("returns empty array when tree has no elements", () => {
		const tree: Tree = {
			id: "root",
			type: "row",
			marginTop: 0,
			marginBottom: 0,
			marginLeft: 0,
			marginRight: 0,
			w: 5,
			h: 0,
			children: [],
		} as unknown as Tree;

		const result = pasteElements({
			elements: [],
			breakpoint,
			clipboardBreakpoint: { cols: 5 },
			tree,
			y: 3,
		});

		expect(result).toEqual([]);
	});
});
