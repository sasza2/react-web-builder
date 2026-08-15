import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockToastPromise = vi.fn();
vi.mock("react-toastify", () => ({
	toast: { promise: (...args: unknown[]) => mockToastPromise(...args) },
}));

const mockSetValue = vi.fn();
let mockValue: unknown;
vi.mock("@/components/FormProvider", () => ({
	useField: () => ({ setValue: mockSetValue, value: mockValue }),
}));

vi.mock("@/components/LoaderSpinner", () => ({
	LoaderSpinner: () => <div data-testid="loader-spinner" />,
}));

let mockIsMountedRef = { current: true };
vi.mock("@/hooks/useIsMounted", () => ({
	useIsMounted: () => mockIsMountedRef,
}));

import { StyleProvider } from "@/components/StyleProvider";

import { FileUpload } from "./FileUpload";

const file = new File(["content"], "photo.png", { type: "image/png" });

const setup = (onImageUpload = vi.fn()) => {
	const utils = render(
		<StyleProvider>
			<FileUpload name="image" onImageUpload={onImageUpload} />
		</StyleProvider>,
	);
	return { onImageUpload, ...utils };
};

const uploadFile = () => {
	const input = document.querySelector(
		'input[type="file"]',
	) as HTMLInputElement;
	Object.defineProperty(input, "files", {
		value: [file],
		configurable: true,
	});
	fireEvent.change(input);
};

describe("FileUpload", () => {
	beforeEach(() => {
		mockSetValue.mockClear();
		mockToastPromise.mockClear();
		mockValue = undefined;
		mockIsMountedRef = { current: true };
	});

	it("renders upload label when no value present", () => {
		setup();
		expect(screen.getByText("element.imageUpload.upload")).not.toBeNull();
	});

	it("renders change label when value already uploaded", () => {
		mockValue = { location: "a.png", locationUpload: "a.png" };
		setup();
		expect(screen.getByText("element.imageUpload.change")).not.toBeNull();
	});

	it("does nothing when there is no file selected", () => {
		const onImageUpload = vi.fn();
		setup(onImageUpload);
		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		Object.defineProperty(input, "files", { value: [], configurable: true });
		fireEvent.change(input);
		expect(onImageUpload).not.toHaveBeenCalled();
	});

	it("clicking the button triggers the hidden file input click", () => {
		setup();
		const input = document.querySelector(
			'input[type="file"]',
		) as HTMLInputElement;
		const clickSpy = vi.spyOn(input, "click");
		fireEvent.click(screen.getByText("element.imageUpload.upload"));
		expect(clickSpy).toHaveBeenCalled();
	});

	it("uploads a file successfully and updates value", async () => {
		const onImageUpload = vi
			.fn()
			.mockResolvedValue({ location: "uploaded.png", upload: "uploaded.png" });
		setup(onImageUpload);

		uploadFile();

		expect(onImageUpload).toHaveBeenCalledWith(file);
		expect(screen.getByTestId("loader-spinner")).not.toBeNull();
		expect(mockToastPromise).toHaveBeenCalled();

		const [promise] = mockToastPromise.mock.calls[0];
		await promise;

		expect(mockSetValue).toHaveBeenCalledWith({
			location: "uploaded.png",
			upload: "uploaded.png",
			locationUpload: "uploaded.png",
		});
	});

	it("ignores loading a second file while already loading", () => {
		const onImageUpload = vi.fn().mockResolvedValue({ location: "x.png" });
		setup(onImageUpload);

		uploadFile();
		uploadFile();

		expect(onImageUpload).toHaveBeenCalledTimes(1);
	});

	it("does not update state if component unmounted before promise resolves", async () => {
		const onImageUpload = vi
			.fn()
			.mockResolvedValue({ location: "y.png", upload: "y.png" });
		setup(onImageUpload);

		uploadFile();
		mockIsMountedRef.current = false;

		const [promise] = mockToastPromise.mock.calls[0];
		await promise;

		expect(mockSetValue).not.toHaveBeenCalled();
	});

	it("handles upload rejection gracefully (validation failure)", async () => {
		const onImageUpload = vi.fn().mockResolvedValue(null);
		setup(onImageUpload);

		uploadFile();

		const [promise] = mockToastPromise.mock.calls[0];
		await expect(promise).rejects.toThrow("errors.somethingWentWrong");
		expect(mockSetValue).not.toHaveBeenCalled();
	});

	it("rejects when resolved upload is not an object", async () => {
		const onImageUpload = vi.fn().mockResolvedValue("not-an-object");
		setup(onImageUpload);

		uploadFile();

		const [promise] = mockToastPromise.mock.calls[0];
		await expect(promise).rejects.toThrow("errors.somethingWentWrong");
		expect(mockSetValue).not.toHaveBeenCalled();
	});

	it("rejects when resolved upload has a non-string location", async () => {
		const onImageUpload = vi
			.fn()
			.mockResolvedValue({ location: 123, upload: "x" });
		setup(onImageUpload);

		uploadFile();

		const [promise] = mockToastPromise.mock.calls[0];
		await expect(promise).rejects.toThrow("errors.somethingWentWrong");
		expect(mockSetValue).not.toHaveBeenCalled();
	});
});
