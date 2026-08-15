import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoints = vi.fn();
const mockUseElements = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseAppSelector = vi.fn();
const mockGetPageSettings = vi.fn();

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

import { useBuildPage } from "./useBuildPage";

describe("useBuildPage", () => {
	it("builds a page from breakpoints, elements and pageSettings, stripping template", () => {
		const breakpoints = [
			{ id: "bp-1", template: { some: "tree" } },
			{ id: "bp-2" },
		];
		mockUseBreakpoints.mockReturnValue(breakpoints);

		const elementsExtras = { current: { "bp-1": {} } };
		mockUseElements.mockReturnValue({ elementsExtras });

		const pageSettings = { id: "page-1", name: "Home" };
		mockUsePageSettings.mockReturnValue(pageSettings);

		const elementsInBreakpoints = { "bp-1": [{ id: "el-1" }] };
		mockUseAppSelector.mockImplementation((selector) =>
			selector({ elementsInBreakpoints }),
		);

		mockGetPageSettings.mockReturnValue({ id: "page-1", name: "Home" });

		const { result } = renderHook(() => useBuildPage());

		const page = result.current();

		expect(mockGetPageSettings).toHaveBeenCalledWith(pageSettings);
		expect(page).toEqual({
			id: "page-1",
			name: "Home",
			breakpoints: [
				{ id: "bp-1", template: null },
				{ id: "bp-2", template: null },
			],
			elementsInBreakpoints,
			elementsExtras: elementsExtras.current,
		});
	});
});
