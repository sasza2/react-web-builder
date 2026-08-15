import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();
const mockBuild = vi.fn();
const mockUseBuildPageWithTree = vi.fn(() => mockBuild);

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));
vi.mock("./page/useBuildPageWithTree", () => ({
	useBuildPageWithTree: () => mockUseBuildPageWithTree(),
}));

import { usePagePreview } from "./usePagePreview";

describe("usePagePreview", () => {
	it("calls onPagePreview with the built page when provided", async () => {
		const onPagePreview = vi.fn().mockResolvedValue(undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onPagePreview });
		const page = { id: "page-1" };
		mockBuild.mockReturnValue(page);

		const { result } = renderHook(() => usePagePreview());
		await result.current();

		expect(onPagePreview).toHaveBeenCalledWith(page);
	});

	it("does nothing when onPagePreview is not provided", async () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		mockBuild.mockReturnValue({ id: "page-1" });

		const { result } = renderHook(() => usePagePreview());
		await expect(result.current()).resolves.toBeUndefined();
	});
});
