import { describe, expect, it, vi } from "vitest";

import { SidebarView } from "@/components/SidebarProvider";

import { addBreakpoint } from "./breakpointsSlice";
import {
	openContainer,
	removeElementsFromBreakpoint,
} from "./elementsInBreakpointsSlice";
import { setSelectedBreakpoint } from "./selectedBreakpointSlice";
import { setSelectedElement } from "./selectedElementSlice";
import reducer, {
	replaceSidebar,
	setSidebar,
	setSidebarView,
	setViewAnimation,
} from "./sidebarSlice";

describe("sidebarSlice", () => {
	it("setSidebarView sets view", () => {
		const next = reducer({ view: null }, setSidebarView(SidebarView.Theme));
		expect(next.view).toBe(SidebarView.Theme);
	});

	it("setSidebar replaces state", () => {
		const next = reducer(
			{ view: null },
			setSidebar({ view: SidebarView.Theme }),
		);
		expect(next).toEqual({ view: SidebarView.Theme });
	});

	it("replaceSidebar replaces state", () => {
		const next = reducer(
			{ view: null },
			replaceSidebar({ view: SidebarView.Configuration }),
		);
		expect(next).toEqual({ view: SidebarView.Configuration });
	});

	it("setSelectedElement sets EditElement view when elementId present", () => {
		const next = reducer(
			{ view: null },
			setSelectedElement({ elementId: "e1" }),
		);
		expect(next.view).toBe(SidebarView.EditElement);
	});

	it("setSelectedElement sets AddElement view when elementId falsy", () => {
		const next = reducer(
			{ view: SidebarView.EditElement },
			setSelectedElement({ elementId: null }),
		);
		expect(next.view).toBe(SidebarView.AddElement);
	});

	it("removeElementsFromBreakpoint switches EditElement to AddElement", () => {
		const next = reducer(
			{ view: SidebarView.EditElement },
			removeElementsFromBreakpoint({
				elementsTree: [],
				currentBreakpoint: { id: "bp1" } as never,
			}),
		);
		expect(next.view).toBe(SidebarView.AddElement);
	});

	it("removeElementsFromBreakpoint leaves other views unchanged", () => {
		const next = reducer(
			{ view: SidebarView.Theme },
			removeElementsFromBreakpoint({
				elementsTree: [],
				currentBreakpoint: { id: "bp1" } as never,
			}),
		);
		expect(next.view).toBe(SidebarView.Theme);
	});

	it("setSelectedBreakpoint sets EditBreakpoint view when no parentId", () => {
		const next = reducer({ view: null }, setSelectedBreakpoint({ id: "bp1" }));
		expect(next.view).toBe(SidebarView.EditBreakpoint);
	});

	it("setSelectedBreakpoint keeps state when parentId present", () => {
		const state = { view: SidebarView.Theme };
		const next = reducer(
			state,
			setSelectedBreakpoint({ id: "bp1", parentId: "parent1" }),
		);
		expect(next).toBe(state);
	});

	it("addBreakpoint sets EditBreakpoint view when no parentId", () => {
		const next = reducer(
			{ view: null },
			addBreakpoint({ breakpoint: { id: "bp1" } as never }),
		);
		expect(next.view).toBe(SidebarView.EditBreakpoint);
	});

	it("addBreakpoint keeps state when breakpoint has parentId", () => {
		const state = { view: SidebarView.Theme };
		const next = reducer(
			state,
			addBreakpoint({ breakpoint: { id: "c1", parentId: "bp1" } as never }),
		);
		expect(next).toBe(state);
	});

	it("openContainer sets AddElement view", () => {
		const next = reducer(
			{ view: null },
			openContainer({ elements: [], breakpointId: "bp1" }),
		);
		expect(next.view).toBe(SidebarView.AddElement);
	});

	it("default case returns state unchanged", () => {
		const state = { view: null };
		expect(reducer(state, { type: "unknown" })).toBe(state);
	});

	describe("setViewAnimation", () => {
		it("dispatches setSidebar when view differs", () => {
			const dispatch = vi.fn();
			const getState = vi
				.fn()
				.mockReturnValue({ sidebar: { view: SidebarView.Theme } });

			setViewAnimation(SidebarView.Configuration)(
				dispatch as never,
				getState as never,
			);

			expect(dispatch).toHaveBeenCalledWith(
				setSidebar({ view: SidebarView.Configuration }),
			);
		});

		it("does nothing when view is the same", () => {
			const dispatch = vi.fn();
			const getState = vi
				.fn()
				.mockReturnValue({ sidebar: { view: SidebarView.Theme } });

			setViewAnimation(SidebarView.Theme)(dispatch as never, getState as never);

			expect(dispatch).not.toHaveBeenCalled();
		});
	});
});
