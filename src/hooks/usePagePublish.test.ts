import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();
const mockBuild = vi.fn();
const mockUseBuildPageWithTree = vi.fn(() => mockBuild);
const mockSetIsSaved = vi.fn();
const mockToastPromise = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));
vi.mock("react-toastify", () => ({
	toast: { promise: (...args: never[]) => mockToastPromise(...args) },
}));
vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));
vi.mock("./page/useBuildPageWithTree", () => ({
	useBuildPageWithTree: () => mockUseBuildPageWithTree(),
}));
vi.mock("./useChangesSetIsSaved", () => ({
	useChangesSetIsSaved: () => mockSetIsSaved,
}));

import { usePagePublish } from "./usePagePublish";

describe("usePagePublish", () => {
	it("does nothing when onPublish is not provided", async () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		const { result } = renderHook(() => usePagePublish());
		await result.current();

		expect(mockToastPromise).not.toHaveBeenCalled();
		expect(mockSetIsSaved).not.toHaveBeenCalled();
	});

	it("publishes the built page, shows toast and marks as saved", async () => {
		const page = { id: "page-1" };
		mockBuild.mockReturnValue(page);
		const onPublish = vi.fn().mockResolvedValue(undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onPublish });

		const { result } = renderHook(() => usePagePublish());
		await result.current();

		expect(onPublish).toHaveBeenCalledWith(page);
		expect(mockToastPromise).toHaveBeenCalledWith(
			expect.any(Promise),
			{
				pending: "publish.save.pending",
				success: "publish.save.success",
				error: "errors.somethingWentWrong",
			},
			{ draggable: false },
		);
		expect(mockSetIsSaved).toHaveBeenCalled();
	});
});
