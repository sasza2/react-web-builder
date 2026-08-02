import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();
const mockBuild = vi.fn();
const mockUseBuildPage = vi.fn(() => mockBuild);
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
vi.mock("./page/useBuildPage", () => ({
	useBuildPage: () => mockUseBuildPage(),
}));
vi.mock("./useChangesSetIsSaved", () => ({
	useChangesSetIsSaved: () => mockSetIsSaved,
}));

import { usePageSaveAsDraft } from "./usePageSaveAsDraft";

describe("usePageSaveAsDraft", () => {
	it("does nothing when onSaveAsDraft is not provided", async () => {
		mockUseWebBuilderProperties.mockReturnValue({});

		const { result } = renderHook(() => usePageSaveAsDraft());
		await result.current();

		expect(mockToastPromise).not.toHaveBeenCalled();
		expect(mockSetIsSaved).not.toHaveBeenCalled();
		expect(mockBuild).not.toHaveBeenCalled();
	});

	it("saves the built page as draft, shows toast and marks as saved", async () => {
		const page = { id: "page-1" };
		mockBuild.mockReturnValue(page);
		const onSaveAsDraft = vi.fn().mockResolvedValue(undefined);
		mockUseWebBuilderProperties.mockReturnValue({ onSaveAsDraft });

		const { result } = renderHook(() => usePageSaveAsDraft());
		await result.current();

		expect(onSaveAsDraft).toHaveBeenCalledWith(page);
		expect(mockToastPromise).toHaveBeenCalledWith(
			expect.any(Promise),
			{
				pending: "publish.draft.pending",
				success: "publish.draft.success",
				error: "errors.somethingWentWrong",
			},
			{ draggable: false },
		);
		expect(mockSetIsSaved).toHaveBeenCalled();
	});
});
