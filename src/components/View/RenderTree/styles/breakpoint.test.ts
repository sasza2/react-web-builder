import type { Breakpoint, Tree } from "types";
import { expect, it } from "vitest";

import { getStyleForBreakpoint } from "./breakpoint";

const BASE_BREAKPOINT = {
	cols: 12,
	rowHeight: 10,
	parentId: null,
} as unknown as Breakpoint;

it("uses the full breakpoint width var when node.w equals breakpoint.cols", () => {
	const node = { w: 12, marginTop: 0, marginBottom: 0 } as unknown as Tree;

	const style = getStyleForBreakpoint(node, BASE_BREAKPOINT);

	expect(style.width).toBe("var(--breakpoint-width)");
});

it("computes a proportional width calc() when node.w is smaller than breakpoint.cols", () => {
	const node = { w: 6, marginTop: 0, marginBottom: 0 } as unknown as Tree;

	const style = getStyleForBreakpoint(node, BASE_BREAKPOINT);

	expect(style.width).toBe("calc(0.500 * var(--breakpoint-width))");
});

it("sets marginTop and paddingTop=0 for a real breakpoint (no parentId)", () => {
	const node = { w: 12, marginTop: 2, marginBottom: 1 } as unknown as Tree;

	const style = getStyleForBreakpoint(node, BASE_BREAKPOINT);

	expect(style.marginTop).toBe(20);
	expect(style.paddingTop).toBe(0);
	expect(style.marginBottom).toBe(10);
});

it("uses paddingTop instead of marginTop for a container (has parentId)", () => {
	const containerBreakpoint = {
		...BASE_BREAKPOINT,
		parentId: "parent-1",
	} as unknown as Breakpoint;
	const node = { w: 12, marginTop: 2, marginBottom: 0 } as unknown as Tree;

	const style = getStyleForBreakpoint(node, containerBreakpoint);

	expect(style.marginTop).toBe(0);
	expect(style.paddingTop).toBe(20);
});

it("leaves marginLeft/marginRight undefined when not set on the node", () => {
	const node = { w: 12, marginTop: 0, marginBottom: 0 } as unknown as Tree;

	const style = getStyleForBreakpoint(node, BASE_BREAKPOINT);

	expect(style.marginLeft).toBeUndefined();
	expect(style.marginRight).toBeUndefined();
});

it("computes marginLeft/marginRight calc() when set on the node", () => {
	const node = {
		w: 12,
		marginTop: 0,
		marginBottom: 0,
		marginLeft: 6,
		marginRight: 3,
	} as unknown as Tree;

	const style = getStyleForBreakpoint(node, BASE_BREAKPOINT);

	expect(style.marginLeft).toBe("calc(0.500 * var(--breakpoint-width))");
	expect(style.marginRight).toBe("calc(0.250 * var(--breakpoint-width))");
});
