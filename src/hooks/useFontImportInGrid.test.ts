import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useContainerElementPropertiesByValue } from "./container/useContainerElementPropertiesByValue";
import { useBreakpoint } from "./useBreakpoint";
import { useBreakpoints } from "./useBreakpoints";
import { useFontImport } from "./useFontImport";
import { useFontImportInGrid } from "./useFontImportInGrid";
import { usePageSettings } from "./usePageSettings";

vi.mock("./container/useContainerElementPropertiesByValue", () => ({
	useContainerElementPropertiesByValue: vi.fn(),
}));
vi.mock("./useBreakpoint", () => ({ useBreakpoint: vi.fn() }));
vi.mock("./useBreakpoints", () => ({ useBreakpoints: vi.fn() }));
vi.mock("./useFontImport", () => ({ useFontImport: vi.fn() }));
vi.mock("./usePageSettings", () => ({ usePageSettings: vi.fn() }));

const mockedUseContainerElementPropertiesByValue = vi.mocked(
	useContainerElementPropertiesByValue,
);
const mockedUseBreakpoint = vi.mocked(useBreakpoint);
const mockedUseBreakpoints = vi.mocked(useBreakpoints);
const mockedUseFontImport = vi.mocked(useFontImport);
const mockedUsePageSettings = vi.mocked(usePageSettings);

describe("useFontImportInGrid", () => {
	it("returns pageSettings.fontFamily when the container has no parentId", () => {
		mockedUsePageSettings.mockReturnValue({ fontFamily: "Georgia" } as never);
		mockedUseBreakpoint.mockReturnValue({ id: "root" } as never);
		mockedUseBreakpoints.mockReturnValue([]);
		mockedUseContainerElementPropertiesByValue.mockReturnValue(() => ({}));
		mockedUseFontImport.mockImplementation((v) => v as never);

		const { result } = renderHook(() => useFontImportInGrid());

		expect(result.current).toBe("Georgia");
	});

	it("returns the container's own fontFamily property when present", () => {
		mockedUsePageSettings.mockReturnValue({ fontFamily: "Georgia" } as never);
		mockedUseBreakpoint.mockReturnValue({
			id: "child",
			parentId: "root",
		} as never);
		mockedUseBreakpoints.mockReturnValue([]);
		mockedUseContainerElementPropertiesByValue.mockReturnValue(() => ({
			fontFamily: "Roboto",
		}));
		mockedUseFontImport.mockImplementation((v) => v as never);

		const { result } = renderHook(() => useFontImportInGrid());

		expect(result.current).toBe("Roboto");
	});

	it("recurses up to the parent when the container has no own fontFamily", () => {
		const root = { id: "root", parentId: null };
		const child = { id: "child", parentId: "root" };
		mockedUsePageSettings.mockReturnValue({ fontFamily: "Georgia" } as never);
		mockedUseBreakpoint.mockReturnValue(child as never);
		mockedUseBreakpoints.mockReturnValue([root, child] as never);
		mockedUseContainerElementPropertiesByValue.mockReturnValue(() => ({}));
		mockedUseFontImport.mockImplementation((v) => v as never);

		const { result } = renderHook(() => useFontImportInGrid());

		expect(result.current).toBe("Georgia");
	});

	it("returns null when the parent referenced by parentId cannot be found", () => {
		const child = { id: "child", parentId: "missing" };
		mockedUsePageSettings.mockReturnValue({ fontFamily: "Georgia" } as never);
		mockedUseBreakpoint.mockReturnValue(child as never);
		mockedUseBreakpoints.mockReturnValue([] as never);
		mockedUseContainerElementPropertiesByValue.mockReturnValue(() => ({}));
		mockedUseFontImport.mockImplementation((v) => v as never);

		const { result } = renderHook(() => useFontImportInGrid());

		expect(result.current).toBe(null);
	});
});
