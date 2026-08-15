import { describe, expect, it } from "vitest";

import { removeAllBreakpoints, removeBreakpoint } from "./breakpointsSlice";
import {
	openContainer,
	removeElementsFromBreakpoint,
	setElementsInBreakpoint,
	setElementsInBreakpointProgrammatic,
} from "./elementsInBreakpointsSlice";
import { setSelectedBreakpoint } from "./selectedBreakpointSlice";
import reducer, {
	replaceSelectedElements,
	setSelectedElements,
	toggleSelectedElement,
} from "./selectedElementsSlice";

describe("selectedElementsSlice", () => {
	it("setSelectedElements sets ids", () => {
		expect(reducer([], setSelectedElements({ elementsIds: ["e1"] }))).toEqual([
			"e1",
		]);
	});

	it("toggleSelectedElement removes when present", () => {
		expect(
			reducer(["e1", "e2"], toggleSelectedElement({ elementId: "e1" })),
		).toEqual(["e2"]);
	});

	it("toggleSelectedElement adds when absent", () => {
		expect(reducer(["e1"], toggleSelectedElement({ elementId: "e2" }))).toEqual(
			["e1", "e2"],
		);
	});

	it("replaceSelectedElements replaces ids", () => {
		expect(
			reducer(["e1"], replaceSelectedElements({ elementsIds: ["e3"] })),
		).toEqual(["e3"]);
	});

	it("removeBreakpoint resets to empty array", () => {
		expect(
			reducer(["e1"], removeBreakpoint({ breakpoint: { id: "bp1" } as never })),
		).toEqual([]);
	});

	it("setSelectedBreakpoint resets to empty array", () => {
		expect(reducer(["e1"], setSelectedBreakpoint({ id: "bp1" }))).toEqual([]);
	});

	it("setElementsInBreakpoint removes ids for deleted elements", () => {
		const elements = [{ id: "e1" }] as never;
		const next = reducer(
			["e1", "e2"],
			setElementsInBreakpoint({ elements, breakpointId: "bp1" }),
		);
		expect(next).toEqual(["e1"]);
	});

	it("setElementsInBreakpoint returns same state ref when nothing removed", () => {
		const elements = [{ id: "e1" }, { id: "e2" }] as never;
		const state = ["e1", "e2"];
		const next = reducer(
			state,
			setElementsInBreakpoint({ elements, breakpointId: "bp1" }),
		);
		expect(next).toBe(state);
	});

	it("setElementsInBreakpointProgrammatic removes ids for deleted elements", () => {
		const elements = [{ id: "e1" }] as never;
		const next = reducer(
			["e1", "e2"],
			setElementsInBreakpointProgrammatic({ elements, breakpointId: "bp1" }),
		);
		expect(next).toEqual(["e1"]);
	});

	it("removeElementsFromBreakpoint resets to empty array", () => {
		const next = reducer(
			["e1"],
			removeElementsFromBreakpoint({
				elementsTree: [],
				currentBreakpoint: { id: "bp1" } as never,
			}),
		);
		expect(next).toEqual([]);
	});

	it("openContainer resets to initial state", () => {
		expect(
			reducer(["e1"], openContainer({ elements: [], breakpointId: "bp1" })),
		).toEqual([]);
	});

	it("removeAllBreakpoints resets to initial state", () => {
		expect(reducer(["e1"], removeAllBreakpoints())).toEqual([]);
	});

	it("default case returns state unchanged", () => {
		const state = ["e1"];
		expect(reducer(state, { type: "unknown" })).toBe(state);
	});
});
