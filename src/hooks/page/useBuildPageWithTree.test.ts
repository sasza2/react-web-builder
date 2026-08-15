import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoints = vi.fn();
const mockUseElements = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseAppSelector = vi.fn();
const mockGetPageSettings = vi.fn();
const mockBuildBreakpointWithTree = vi.fn();
const mockUseBuildBreakpointWithTree = vi.fn(() => mockBuildBreakpointWithTree);

vi.mock("../useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));
vi.mock("../useElements", () => ({
	useElements: () => mockUseElements(),
}));
vi.mock("../usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));
vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: never) => mockUseAppSelector(selector),
}));
vi.mock("@/utils/pageSettings", () => ({
	getPageSettings: (...args: never[]) => mockGetPageSettings(...args),
}));
vi.mock("./useBuildBreakpointWithTree", () => ({
	useBuildBreakpointWithTree: () => mockUseBuildBreakpointWithTree(),
}));

import { useBuildPageWithTree } from "./useBuildPageWithTree";

describe("useBuildPageWithTree", () => {
	it("flattens elementsInBreakpoints, builds breakpoints with tree and filters those with no view", () => {
		const breakpoints = [{ id: "bp-1" }, { id: "bp-2" }];
		mockUseBreakpoints.mockReturnValue(breakpoints);

		const elementsExtras = { current: {} };
		mockUseElements.mockReturnValue({ elementsExtras });

		const pageSettings = { id: "page-1" };
		mockUsePageSettings.mockReturnValue(pageSettings);

		const elementsInBreakpoints = {
			"bp-1": [{ id: "el-1" }],
			"bp-2": [{ id: "el-2" }, { id: "el-3" }],
		};
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ elementsInBreakpoints }),
		);

		mockGetPageSettings.mockReturnValue({ id: "page-1" });

		mockBuildBreakpointWithTree.mockImplementation((breakpoint) => {
			if (breakpoint.id === "bp-1") return { ...breakpoint, view: { x: 1 } };
			return { ...breakpoint, view: null };
		});

		const { result } = renderHook(() => useBuildPageWithTree());

		const page = result.current();

		expect(page.breakpoints).toEqual([{ id: "bp-1", view: { x: 1 } }]);
		expect(page.elementsInBreakpoints).toBe(elementsInBreakpoints);
		expect(page.elementsExtras).toBe(elementsExtras.current);
		expect(page.id).toBe("page-1");

		// elements flattened with breakpointId attached
		const buildElements = vi.mocked(mockBuildBreakpointWithTree).mock.calls;
		expect(buildElements.length).toBe(2);
	});

	it("returns no breakpoints when none have a view", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "bp-1" }]);
		mockUseElements.mockReturnValue({ elementsExtras: { current: {} } });
		mockUsePageSettings.mockReturnValue({});
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ elementsInBreakpoints: {} }),
		);
		mockGetPageSettings.mockReturnValue({});
		mockBuildBreakpointWithTree.mockImplementation((breakpoint) => ({
			...breakpoint,
			view: null,
		}));

		const { result } = renderHook(() => useBuildPageWithTree());
		const page = result.current();

		expect(page.breakpoints).toEqual([]);
	});
});
