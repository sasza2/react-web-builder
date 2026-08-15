import type { Breakpoint, Tree } from "types";
import { expect, it } from "vitest";

import { getStyleForFixedChild, getStyleForFixedParent } from "./fixed";

const BREAKPOINT = { cols: 12, rowHeight: 10 } as unknown as Breakpoint;

it("getStyleForFixedParent computes position + minHeight based on node.h and rowHeight", () => {
	const node = { h: 5 } as unknown as Tree;

	const style = getStyleForFixedParent(node, BREAKPOINT);

	expect(style.position).toBe("relative");
	expect(style.minHeight).toBe("calc(50px * var(--breakpoint-scale))");
});

it("getStyleForFixedChild computes position/width/top/left based on child + breakpoint", () => {
	const child = {
		w: 6,
		marginTop: 2,
		marginLeft: 3,
	} as unknown as Tree;

	const style = getStyleForFixedChild(child, BREAKPOINT);

	expect(style.position).toBe("absolute");
	expect(style.width).toBe("calc(0.500 * var(--breakpoint-width))");
	expect(style.top).toBe("calc(20px * var(--breakpoint-scale))");
	expect(style.left).toBe("calc(0.250 * var(--breakpoint-width))");
});
