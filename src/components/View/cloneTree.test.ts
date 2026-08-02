import type { Tree } from "types";
import { expect, it, vi } from "vitest";

import { cloneTree } from "./cloneTree";

it("clones a component node and generates a new id via createUniqueId", () => {
	const createUniqueId = vi.fn((current: string) => `${current}-clone`);
	const tree = {
		type: "component",
		element: { id: "el-1" },
	} as unknown as Tree;

	const result = cloneTree(tree, createUniqueId);

	expect(result).not.toBe(tree);
	expect((result as unknown as { element: { id: string } }).element.id).toBe(
		"el-1-clone",
	);
	expect(createUniqueId).toHaveBeenCalledWith("el-1");
});

it("does not touch element for non-component nodes", () => {
	const createUniqueId = vi.fn((current: string) => `${current}-clone`);
	const tree = { type: "row" } as unknown as Tree;

	const result = cloneTree(tree, createUniqueId);

	expect(createUniqueId).not.toHaveBeenCalled();
	expect((result as unknown as { element?: unknown }).element).toBeUndefined();
});

it("recursively clones children", () => {
	const createUniqueId = vi.fn((current: string) => `${current}-clone`);
	const tree = {
		type: "row",
		children: [
			{ type: "component", element: { id: "child-1" } },
			{ type: "component", element: { id: "child-2" } },
		],
	} as unknown as Tree;

	const result = cloneTree(tree, createUniqueId) as unknown as {
		children: Array<{ element: { id: string } }>;
	};

	expect(result.children[0].element.id).toBe("child-1-clone");
	expect(result.children[1].element.id).toBe("child-2-clone");
	expect(result.children).not.toBe(
		(tree as unknown as { children: unknown }).children,
	);
});

it("leaves tree without children untouched (no children key added)", () => {
	const createUniqueId = vi.fn((current: string) => current);
	const tree = { type: "row" } as unknown as Tree;

	const result = cloneTree(tree, createUniqueId);

	expect("children" in (result as unknown as Record<string, unknown>)).toBe(
		false,
	);
});
