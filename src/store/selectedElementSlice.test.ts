import { describe, expect, it } from "vitest";

import { SidebarView } from "@/components/SidebarProvider";

import { removeAllBreakpoints } from "./breakpointsSlice";
import {
	openContainer,
	removeElementsFromBreakpoint,
} from "./elementsInBreakpointsSlice";
import reducer, {
	replaceSelectedElement,
	setSelectedElement,
} from "./selectedElementSlice";
import { setSidebar, setSidebarView } from "./sidebarSlice";

describe("selectedElementSlice", () => {
	it("setSelectedElement sets elementId", () => {
		expect(reducer(null, setSelectedElement({ elementId: "e1" }))).toBe("e1");
	});

	it("replaceSelectedElement sets elementId", () => {
		expect(reducer(null, replaceSelectedElement({ elementId: "e2" }))).toBe(
			"e2",
		);
	});

	it("removeElementsFromBreakpoint clears selected when matching element removed", () => {
		const elementsTree = [{ element: { id: "e1" }, children: [] }] as never;
		expect(
			reducer(
				"e1",
				removeElementsFromBreakpoint({
					elementsTree,
					currentBreakpoint: { id: "bp1" } as never,
				}),
			),
		).toBeNull();
	});

	it("removeElementsFromBreakpoint keeps state when no match", () => {
		const elementsTree = [{ element: { id: "other" }, children: [] }] as never;
		expect(
			reducer(
				"e1",
				removeElementsFromBreakpoint({
					elementsTree,
					currentBreakpoint: { id: "bp1" } as never,
				}),
			),
		).toBe("e1");
	});

	it("setSidebar resets to null when not EditElement view", () => {
		expect(
			reducer("e1", setSidebar({ view: SidebarView.AddElement })),
		).toBeNull();
	});

	it("setSidebar throws when EditElement view (bug: reducer returns undefined on primitive state)", () => {
		// The extraReducer callback falls through without returning when
		// payload.view === EditElement, i.e. implicitly returns undefined.
		// Because this slice's state is a primitive (string | null), Immer's
		// "auto-freezing draft" mechanism does not apply and returning
		// undefined from a case reducer throws instead of being treated as
		// "no change". See COVERAGE_PROGRESS.md Stage 6 bugs section.
		expect(() =>
			reducer("e1", setSidebar({ view: SidebarView.EditElement })),
		).toThrow(/must not return undefined/);
	});

	it("setSidebarView resets to null when not EditElement view", () => {
		expect(reducer("e1", setSidebarView(SidebarView.AddElement))).toBeNull();
	});

	it("setSidebarView throws when EditElement view (same bug as setSidebar)", () => {
		expect(() =>
			reducer("e1", setSidebarView(SidebarView.EditElement)),
		).toThrow(/must not return undefined/);
	});

	it("openContainer resets to null", () => {
		expect(
			reducer("e1", openContainer({ elements: [], breakpointId: "bp1" })),
		).toBeNull();
	});

	it("removeAllBreakpoints resets to null", () => {
		expect(reducer("e1", removeAllBreakpoints())).toBeNull();
	});

	it("default case returns state unchanged", () => {
		expect(reducer("e1", { type: "unknown" })).toBe("e1");
	});
});
