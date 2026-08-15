import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();
const mockBuild = vi.fn();
const mockUseBuildPageWithTree = vi.fn(() => mockBuild);
const mockSetIsSaved = vi.fn();
const mockIsMounted = { current: true };
const mockDelay = vi.fn().mockResolvedValue(undefined);

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));
vi.mock("@/utils/delay", () => ({
	delay: (...args: never[]) => mockDelay(...args),
}));
vi.mock("./page/useBuildPageWithTree", () => ({
	useBuildPageWithTree: () => mockUseBuildPageWithTree(),
}));
vi.mock("./useChangesSetIsSaved", () => ({
	useChangesSetIsSaved: () => mockSetIsSaved,
}));
vi.mock("./useIsMounted", () => ({
	useIsMounted: () => mockIsMounted,
}));

import { usePageOnChange } from "./usePageOnChange";

describe("usePageOnChange", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("does nothing when onChange is not provided", async () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		const { result } = renderHook(() => usePageOnChange());
		await result.current();

		expect(mockDelay).not.toHaveBeenCalled();
		expect(mockSetIsSaved).not.toHaveBeenCalled();
	});

	it("delays, builds the page and calls onChange when still mounted", async () => {
		mockIsMounted.current = true;
		const page = { id: "page-1" };
		mockBuild.mockReturnValue(page);
		const onChange = vi.fn().mockResolvedValue(undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onChange });

		const { result } = renderHook(() => usePageOnChange());
		await result.current();

		expect(mockDelay).toHaveBeenCalledWith(2000);
		expect(onChange).toHaveBeenCalledWith(page);
		expect(mockSetIsSaved).toHaveBeenCalled();
	});

	it("bails out after delay when the component has unmounted", async () => {
		mockIsMounted.current = false;
		const onChange = vi.fn().mockResolvedValue(undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onChange });

		const { result } = renderHook(() => usePageOnChange());
		await result.current();

		expect(onChange).not.toHaveBeenCalled();
		expect(mockSetIsSaved).not.toHaveBeenCalled();
	});
});
