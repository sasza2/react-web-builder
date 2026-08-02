import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const mockRestartTemplate = vi.fn();
const mockValidatePage = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/Grid/RestartTemplate", () => ({
	useRestartTemplate: () => mockRestartTemplate,
}));

vi.mock("@/hooks/page/useValidatePage", () => ({
	useValidatePage: () => mockValidatePage,
}));

vi.mock("react-toastify", () => ({
	toast: {
		promise: vi.fn((promise: Promise<unknown>) => {
			// swallow rejections like the real react-toastify does internally
			promise.catch(() => {});
			return promise;
		}),
	},
}));

import { UploadPage } from "./UploadPage";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const getFileInput = (container: HTMLElement) =>
	container.querySelector('input[type="file"]') as HTMLInputElement;

describe("UploadPage", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockValidatePage.mockReturnValue(true);
		mockRestartTemplate.mockResolvedValue(undefined);
	});

	it("renders the upload link button and triggers the hidden file input on click", () => {
		const { container } = renderWithTheme(<UploadPage />);
		const clickSpy = vi.spyOn(getFileInput(container), "click");

		fireEvent.click(container.querySelector("button"));

		expect(clickSpy).toHaveBeenCalled();
	});

	const triggerFileChange = async (
		container: HTMLElement,
		fileContent: string | null,
		fileName = "page.json",
	) => {
		const input = getFileInput(container);
		if (fileContent !== null) {
			const file = new File([fileContent], fileName, {
				type: "application/json",
			});
			Object.defineProperty(input, "files", {
				value: [file],
				configurable: true,
			});
		} else {
			Object.defineProperty(input, "files", {
				value: [],
				configurable: true,
			});
		}

		await act(async () => {
			fireEvent.change(input);
			// allow FileReader's async onload microtask/callback to flush
			await new Promise((resolve) => setTimeout(resolve, 0));
		});
	};

	it("parses, validates, and restarts the template with a valid uploaded page", async () => {
		const { container } = renderWithTheme(<UploadPage />);
		await triggerFileChange(container, JSON.stringify({ id: "page-1" }));

		expect(mockValidatePage).toHaveBeenCalledWith({ id: "page-1" });
		expect(mockRestartTemplate).toHaveBeenCalledWith({ id: "page-1" });
		expect(toast.promise).toHaveBeenCalled();
	});

	it("rejects when the JSON is invalid", async () => {
		const { container } = renderWithTheme(<UploadPage />);
		await triggerFileChange(container, "not valid json{{{");

		expect(mockRestartTemplate).not.toHaveBeenCalled();
	});

	it("rejects when validatePage returns false", async () => {
		mockValidatePage.mockReturnValue(false);
		const { container } = renderWithTheme(<UploadPage />);
		await triggerFileChange(container, JSON.stringify({ id: "page-1" }));

		expect(mockRestartTemplate).not.toHaveBeenCalled();
	});

	it("rejects when no file is selected", async () => {
		const { container } = renderWithTheme(<UploadPage />);
		await triggerFileChange(container, null);

		expect(mockValidatePage).not.toHaveBeenCalled();
		expect(mockRestartTemplate).not.toHaveBeenCalled();
	});

	it("rejects when restartTemplate's promise rejects", async () => {
		mockRestartTemplate.mockRejectedValue(new Error("fail"));
		const { container } = renderWithTheme(<UploadPage />);
		await triggerFileChange(container, JSON.stringify({ id: "page-1" }));

		expect(mockRestartTemplate).toHaveBeenCalled();
	});

	it("cleans up the change listener on unmount", () => {
		const { unmount, container } = renderWithTheme(<UploadPage />);
		const input = getFileInput(container);
		const removeSpy = vi.spyOn(input, "removeEventListener");

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("change", expect.any(Function));
	});
});
