import { describe, expect, it } from "vitest";

import { removeAllBreakpoints } from "./breakpointsSlice";
import reducer, {
	addElementsToBreakpoint,
	addElementToBreakpoint,
	changeElementInBreakpoint,
	openContainer,
	pasteElements,
	removeElementsFromBreakpoint,
	replaceElementsInBreakpoint,
	setElementsInBreakpoint,
	setElementsInBreakpointProgrammatic,
} from "./elementsInBreakpointsSlice";

describe("elementsInBreakpointsSlice", () => {
	it("addElementToBreakpoint creates array if missing", () => {
		const el = { id: "e1" } as never;
		const next = reducer(
			{},
			addElementToBreakpoint({ element: el, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: [el] });
	});

	it("addElementToBreakpoint appends to existing array", () => {
		const el1 = { id: "e1" } as never;
		const el2 = { id: "e2" } as never;
		const next = reducer(
			{ bp1: [el1] },
			addElementToBreakpoint({ element: el2, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: [el1, el2] });
	});

	it("addElementsToBreakpoint creates array if missing", () => {
		const els = [{ id: "e1" }, { id: "e2" }] as never;
		const next = reducer(
			{},
			addElementsToBreakpoint({ elements: els, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: els });
	});

	it("addElementsToBreakpoint appends to existing array", () => {
		const el1 = { id: "e1" } as never;
		const els = [{ id: "e2" }] as never;
		const next = reducer(
			{ bp1: [el1] },
			addElementsToBreakpoint({ elements: els, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: [el1, { id: "e2" }] });
	});

	it("changeElementInBreakpoint updates matching element", () => {
		const state = { bp1: [{ id: "e1", value: 1 }] } as never;
		const next = reducer(
			state,
			changeElementInBreakpoint({
				element: { id: "e1", value: 2 } as never,
				breakpointId: "bp1",
			}),
		);
		expect(next).toEqual({ bp1: [{ id: "e1", value: 2 }] });
	});

	it("changeElementInBreakpoint no-op when element not found", () => {
		const state = { bp1: [{ id: "e1", value: 1 }] } as never;
		const next = reducer(
			state,
			changeElementInBreakpoint({
				element: { id: "missing", value: 2 } as never,
				breakpointId: "bp1",
			}),
		);
		expect(next).toEqual(state);
	});

	it("pasteElements adds recursively including nested containers", () => {
		const bp1 = { id: "bp1" } as never;
		const container = { id: "c1" } as never;
		const elementsTree = [
			{
				element: { id: "e1" },
				container,
				children: [{ element: { id: "e2" }, children: [] }],
			},
		] as never;

		const next = reducer(
			{},
			pasteElements({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toEqual({
			bp1: [{ id: "e1" }],
			c1: [{ id: "e2" }],
		});
	});

	it("pasteElements appends to an already-existing breakpoint array", () => {
		const bp1 = { id: "bp1" } as never;
		const elementsTree = [{ element: { id: "e2" }, children: [] }] as never;

		const next = reducer(
			{ bp1: [{ id: "e1" }] } as never,
			pasteElements({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toEqual({ bp1: [{ id: "e1" }, { id: "e2" }] });
	});

	it("openContainer sets elements", () => {
		const els = [{ id: "e1" }] as never;
		const next = reducer(
			{},
			openContainer({ elements: els, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: els });
	});

	it("setElementsInBreakpoint sets elements", () => {
		const els = [{ id: "e1" }] as never;
		const next = reducer(
			{},
			setElementsInBreakpoint({ elements: els, breakpointId: "bp1" }),
		);
		expect(next).toEqual({ bp1: els });
	});

	it("setElementsInBreakpointProgrammatic sets elements", () => {
		const els = [{ id: "e1" }] as never;
		const next = reducer(
			{},
			setElementsInBreakpointProgrammatic({
				elements: els,
				breakpointId: "bp1",
			}),
		);
		expect(next).toEqual({ bp1: els });
	});

	it("removeElementsFromBreakpoint removes nested containers and elements, and breakpoint itself", () => {
		const bp1 = { id: "bp1" } as never;
		const container = { id: "c1" } as never;
		const elementsTree = [
			{
				element: { id: "e1" },
				container,
				children: [{ element: { id: "e2" }, children: [] }],
			},
		] as never;

		const state = {
			bp1: [{ id: "e1" }, { id: "keep" }],
			c1: [{ id: "e2" }],
		} as never;

		const next = reducer(
			state,
			removeElementsFromBreakpoint({
				elementsTree,
				currentBreakpoint: bp1,
				removeBreakpoint: true,
			}),
		);
		expect(next.c1).toBeUndefined();
		expect(next.bp1).toBeUndefined();
	});

	it("removeElementsFromBreakpoint without removeBreakpoint keeps breakpoint entry", () => {
		const bp1 = { id: "bp1" } as never;
		const elementsTree = [{ element: { id: "e1" }, children: [] }] as never;
		const state = { bp1: [{ id: "e1" }, { id: "keep" }] } as never;

		const next = reducer(
			state,
			removeElementsFromBreakpoint({ elementsTree, currentBreakpoint: bp1 }),
		);
		expect(next).toEqual({ bp1: [{ id: "keep" }] });
	});

	it("replaceElementsInBreakpoint replaces whole state", () => {
		const next = reducer(
			{ old: [] } as never,
			replaceElementsInBreakpoint({ elementsInBreakpoints: { bp1: [] } }),
		);
		expect(next).toEqual({ bp1: [] });
	});

	it("removeAllBreakpoints resets to initial state", () => {
		const next = reducer({ bp1: [] } as never, removeAllBreakpoints());
		expect(next).toEqual({});
	});

	it("default case returns state unchanged", () => {
		const state = { bp1: [] } as never;
		expect(reducer(state, { type: "unknown" })).toBe(state);
	});
});
