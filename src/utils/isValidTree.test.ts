import type { Tree } from "types";
import { describe, expect, it } from "vitest";

import { isValidTree } from "./isValidTree";

const baseComponentNode = (overrides = {}): Tree =>
	({
		id: "comp-1",
		type: "component",
		marginTop: 0,
		marginRight: 0,
		marginBottom: 0,
		marginLeft: 0,
		w: 1,
		element: {
			id: "el-1",
			componentName: "Text",
			props: [],
		},
		...overrides,
	}) as unknown as Tree;

describe("isValidTree", () => {
	it("returns true for a valid component tree", () => {
		expect(isValidTree(baseComponentNode())).toBe(true);
	});

	it("returns errors when node is missing", () => {
		expect(isValidTree(undefined as unknown as Tree)).toEqual([
			{ error: "FIELD_NOT_EXIST", field: "template" },
		]);
	});

	it("returns error when node has no id", () => {
		const errors = isValidTree(baseComponentNode({ id: undefined })) as {
			error: string;
			field: string;
		}[];

		expect(errors).toContainEqual({
			error: "FIELD_DOESNT_EXIST",
			field: "template.id",
		});
	});

	it("returns error when integer fields are not numbers", () => {
		const errors = isValidTree(baseComponentNode({ w: "not-a-number" })) as {
			error: string;
			field: string;
		}[];

		expect(errors).toContainEqual({
			error: "FIELD_IS_NOT_A_NUMBER",
			field: "template.w",
		});
	});

	it("returns error when component element is missing", () => {
		expect(isValidTree(baseComponentNode({ element: undefined }))).toEqual([
			{ error: "FIELD_DOESNT_EXIST", field: "template.element" },
		]);
	});

	it("returns errors when component element fields are missing", () => {
		const errors = isValidTree(
			baseComponentNode({
				element: { id: undefined, componentName: undefined, props: {} },
			}),
		) as { error: string; field: string }[];

		expect(errors).toContainEqual({
			error: "FIELD_DOESNT_EXIST",
			field: "template.element.componentName",
		});
		expect(errors).toContainEqual({
			error: "FIELD_DOESNT_EXIST",
			field: "template.element.id",
		});
		expect(errors).toContainEqual({
			error: "ELEMENT_PROPS_ARE_NOT_ARRAY",
			field: "template.element.props",
		});
	});

	it("returns error for an unknown node type", () => {
		const node = {
			id: "n",
			type: "unknown",
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			w: 1,
		} as unknown as Tree;

		expect(isValidTree(node)).toEqual([
			{ error: "UNKNOWN_TYPE", field: "template.type" },
		]);
	});

	it("returns error when children is not an array", () => {
		const node = {
			id: "n",
			type: "row",
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			w: 1,
			children: undefined,
		} as unknown as Tree;

		expect(isValidTree(node)).toEqual([
			{ error: "CHILDREN_ARE_NOT_ARRAY", field: "template.children" },
		]);
	});

	it("returns error when column children widths exceed parent width", () => {
		const node = {
			id: "n",
			type: "column",
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			w: 2,
			children: [baseComponentNode({ w: 3 })],
		} as unknown as Tree;

		const errors = isValidTree(node) as { error: string; field: string }[];

		expect(errors).toContainEqual({
			error:
				"SUM_OF_MARGIN_LEFT_AND_RIGHT_AND_W_IN_CHILDREN_IS_BIGGER_THAN_PARENT",
			field: "template.children",
		});
	});

	it("returns error when row child width exceeds parent width", () => {
		const node = {
			id: "n",
			type: "row",
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			w: 2,
			children: [baseComponentNode({ w: 3 })],
		} as unknown as Tree;

		const errors = isValidTree(node) as { error: string; field: string }[];

		expect(errors).toContainEqual({
			error:
				"SUM_OF_MARGIN_LEFT_AND_RIGHT_AND_W_IN_CHILD_IS_BIGGER_THAN_PARENT",
			field: "template.children[0]",
		});
	});

	it("validates nested valid row/column trees", () => {
		const node = {
			id: "n",
			type: "row",
			marginTop: 0,
			marginRight: 0,
			marginBottom: 0,
			marginLeft: 0,
			w: 5,
			children: [baseComponentNode({ w: 5 })],
		} as unknown as Tree;

		expect(isValidTree(node)).toBe(true);
	});
});
