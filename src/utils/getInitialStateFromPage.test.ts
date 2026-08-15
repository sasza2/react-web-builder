import type { Page } from "types";
import { describe, expect, it } from "vitest";

import getInitialStateFromPage, {
	getLastBreakpointId,
} from "./getInitialStateFromPage";

describe("getLastBreakpointId", () => {
	it("returns null when there are no top-level breakpoints", () => {
		expect(
			getLastBreakpointId([{ id: "a", parentId: "root" }] as never),
		).toBeNull();
	});

	it("returns the id of the last top-level breakpoint", () => {
		expect(
			getLastBreakpointId([
				{ id: "a" },
				{ id: "b" },
				{ id: "c", parentId: "b" },
			] as never),
		).toBe("b");
	});
});

describe("getInitialStateFromPage", () => {
	it("returns default breakpoints when no page provided", () => {
		const state = getInitialStateFromPage();

		expect(state.breakpoints).toHaveLength(2);
		expect(state.selectedBreakpoint).toBe(state.breakpoints[1].id);
		expect(state.changes.initial).toEqual({
			breakpoints: state.breakpoints,
			selectedBreakpoint: state.selectedBreakpoint,
		});
	});

	it("builds state from a given page", () => {
		const page = {
			breakpoints: [{ id: "bp-1" }],
			elementsInBreakpoints: { "bp-1": [] },
			backgroundColor: "#fff",
		} as unknown as Page;

		const state = getInitialStateFromPage(page);

		expect(state.breakpoints).toEqual(page.breakpoints);
		expect(state.selectedBreakpoint).toBe("bp-1");
		expect(state.elementsInBreakpoints).toEqual({ "bp-1": [] });
		expect(state.pageSettings).toEqual({ backgroundColor: "#fff" });
	});

	it("defaults missing breakpoints and elementsInBreakpoints to empty", () => {
		const page = {} as unknown as Page;

		const state = getInitialStateFromPage(page);

		expect(state.breakpoints).toEqual([]);
		expect(state.elementsInBreakpoints).toEqual({});
		expect(state.selectedBreakpoint).toBeNull();
	});
});
