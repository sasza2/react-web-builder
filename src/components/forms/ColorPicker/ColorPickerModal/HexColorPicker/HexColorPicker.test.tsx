import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { HexColorPicker } from "./HexColorPicker";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("HexColorPicker", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("renders the sketch picker with children", () => {
		renderWithTheme(
			<HexColorPicker setValue={vi.fn()} value="#ff0000">
				<div>child</div>
			</HexColorPicker>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("shows the transparent info label when the color is transparent", () => {
		renderWithTheme(<HexColorPicker setValue={vi.fn()} value="#ffffff00" />);

		expect(screen.getByText(/color\.transparentInfo/)).not.toBeNull();
	});

	it("does not show the transparent info for opaque colors", () => {
		renderWithTheme(<HexColorPicker setValue={vi.fn()} value="#ff0000" />);

		expect(screen.queryByText(/color\.transparentInfo/)).toBeNull();
	});

	const getHexInput = (container: HTMLElement) =>
		container.querySelectorAll("input").item(0) as HTMLInputElement;

	it("debounces setValue calls on color change", () => {
		const setValue = vi.fn();
		const { container } = renderWithTheme(
			<HexColorPicker setValue={setValue} value="#ff0000" />,
		);

		const hexInput = getHexInput(container);
		expect(hexInput.value).toBe("FF0000");

		fireEvent.change(hexInput, { target: { value: "00ff00" } });

		expect(setValue).not.toHaveBeenCalled();

		vi.advanceTimersByTime(200);

		expect(setValue).toHaveBeenCalledWith("#00ff00ff");
	});

	it("clears the previous debounce timer on rapid changes", () => {
		const setValue = vi.fn();
		const { container } = renderWithTheme(
			<HexColorPicker setValue={setValue} value="#ff0000" />,
		);

		const hexInput = getHexInput(container);

		fireEvent.change(hexInput, { target: { value: "00ff00" } });
		vi.advanceTimersByTime(50);
		fireEvent.change(hexInput, { target: { value: "0000ff" } });
		vi.advanceTimersByTime(200);

		expect(setValue).toHaveBeenCalledTimes(1);
		expect(setValue).toHaveBeenCalledWith("#0000ffff");
	});
});
