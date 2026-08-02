import { describe, expect, it } from "vitest";

import reducer, {
	addBreakpoint,
	addBreakpointSilent,
	removeAllBreakpoints,
	removeBreakpoint,
	replaceBreakpoints,
	updateBreakpoint,
	updateBreakpointSilent,
} from "./breakpointsSlice";
import {
	pasteElements,
	removeElementsFromBreakpoint,
} from "./elementsInBreakpointsSlice";

describe("breakpointsSlice", () => {
	const bp1 = { id: "bp1" } as never;
	const bp2 = { id: "bp2" } as never;

	it("addBreakpoint", () => {
		expect(reducer([bp1] as never, addBreakpoint({ breakpoint: bp2 }))).toEqual(
			[bp1, bp2],
		);
	});

	it("addBreakpointSilent", () => {
		expect(
			reducer([bp1] as never, addBreakpointSilent({ breakpoint: bp2 })),
		).toEqual([bp1, bp2]);
	});

	it("removeBreakpoint", () => {
		expect(
			reducer([bp1, bp2] as never, removeBreakpoint({ breakpoint: bp1 })),
		).toEqual([bp2]);
	});

	it("updateBreakpoint", () => {
		const state = [{ id: "bp1", width: 100 }] as never;
		const next = reducer(
			state,
			updateBreakpoint({
				breakpointId: "bp1",
				breakpoint: { width: 200 } as never,
			}),
		);
		expect(next).toEqual([{ id: "bp1", width: 200 }]);
	});

	it("updateBreakpointSilent", () => {
		const state = [{ id: "bp1", width: 100 }] as never;
		const next = reducer(
			state,
			updateBreakpointSilent({
				breakpointId: "bp1",
				breakpoint: { width: 300 } as never,
			}),
		);
		expect(next).toEqual([{ id: "bp1", width: 300 }]);
	});

	it("replaceBreakpoints", () => {
		expect(
			reducer([bp1] as never, replaceBreakpoints({ breakpoints: [bp2] })),
		).toEqual([bp2]);
	});

	it("removeAllBreakpoints", () => {
		expect(reducer([bp1, bp2] as never, removeAllBreakpoints())).toEqual([]);
	});

	it("pasteElements adds containers recursively", () => {
		const container1 = { id: "c1" };
		const container2 = { id: "c2" };
		const elementsTree = [
			{
				container: container1,
				children: [{ container: container2, children: [] }],
			},
			{ children: [] },
		] as never;

		const next = reducer(
			[] as never,
			pasteElements({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toEqual([container1, container2]);
	});

	it("removeElementsFromBreakpoint removes matching containers", () => {
		const container1 = { id: "c1" };
		const elementsTree = [{ container: container1, children: [] }] as never;
		const state = [bp1, container1] as never;

		const next = reducer(
			state,
			removeElementsFromBreakpoint({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toEqual([bp1]);
	});

	it("removeElementsFromBreakpoint with no containers returns same state", () => {
		const elementsTree = [{ children: [] }] as never;
		const state = [bp1] as never;

		const next = reducer(
			state,
			removeElementsFromBreakpoint({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toBe(state);
	});

	it("default case returns state unchanged", () => {
		const state = [bp1] as never;
		expect(reducer(state, { type: "unknown" })).toBe(state);
	});
});
