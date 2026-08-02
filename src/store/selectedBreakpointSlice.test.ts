import { describe, expect, it } from "vitest";

import {
	addBreakpoint,
	removeAllBreakpoints,
	removeBreakpoint,
} from "./breakpointsSlice";
import { openContainer } from "./elementsInBreakpointsSlice";
import reducer, {
	replaceBreakpoint,
	setSelectedBreakpoint,
} from "./selectedBreakpointSlice";
import { setSelectedElement } from "./selectedElementSlice";

describe("selectedBreakpointSlice", () => {
	it("setSelectedBreakpoint sets id", () => {
		expect(reducer(null, setSelectedBreakpoint({ id: "bp1" }))).toBe("bp1");
	});

	it("setSelectedBreakpoint falls back to null when id falsy", () => {
		expect(reducer("bp1", setSelectedBreakpoint({ id: null }))).toBeNull();
	});

	it("replaceBreakpoint sets id", () => {
		expect(reducer(null, replaceBreakpoint({ id: "bp2" }))).toBe("bp2");
	});

	it("replaceBreakpoint falls back to null", () => {
		expect(reducer("bp2", replaceBreakpoint({ id: null }))).toBeNull();
	});

	it("addBreakpoint sets state when not a container breakpoint", () => {
		const breakpoint = { id: "bp1" } as never;
		expect(reducer(null, addBreakpoint({ breakpoint }))).toBe("bp1");
	});

	it("addBreakpoint keeps state when breakpoint is a container", () => {
		const breakpoint = { id: "c1", parentId: "bp1" } as never;
		expect(reducer("prev", addBreakpoint({ breakpoint }))).toBe("prev");
	});

	it("removeBreakpoint resets to null when it was selected", () => {
		expect(
			reducer("bp1", removeBreakpoint({ breakpoint: { id: "bp1" } as never })),
		).toBeNull();
	});

	it("removeBreakpoint keeps state when different breakpoint removed", () => {
		expect(
			reducer("bp1", removeBreakpoint({ breakpoint: { id: "bp2" } as never })),
		).toBe("bp1");
	});

	it("setSelectedElement sets breakpointId when defined", () => {
		expect(
			reducer(
				"prev",
				setSelectedElement({ elementId: "e1", breakpointId: "bp3" }),
			),
		).toBe("bp3");
	});

	it("setSelectedElement keeps state when breakpointId undefined", () => {
		expect(reducer("prev", setSelectedElement({ elementId: "e1" }))).toBe(
			"prev",
		);
	});

	it("openContainer sets breakpointId", () => {
		expect(
			reducer("prev", openContainer({ elements: [], breakpointId: "bp4" })),
		).toBe("bp4");
	});

	it("removeAllBreakpoints resets to null", () => {
		expect(reducer("bp1", removeAllBreakpoints())).toBeNull();
	});

	it("default case returns state unchanged", () => {
		expect(reducer("bp1", { type: "unknown" })).toBe("bp1");
	});
});
