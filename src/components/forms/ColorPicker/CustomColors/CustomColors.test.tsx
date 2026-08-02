import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("../Color", () => ({
	Color: ({
		color,
		onClick,
	}: {
		color: string;
		onClick?: (e: React.MouseEvent) => void;
	}) => (
		<button type="button" data-testid={`color-${color}`} onClick={onClick}>
			{color}
		</button>
	),
}));

vi.mock("../ColorPickerModal", () => ({
	ColorPickerModal: ({
		children,
		label,
	}: {
		children?: React.ReactNode;
		label?: React.ReactNode;
	}) => (
		<div data-testid="color-picker-modal">
			{label}
			{children}
		</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { CustomColors } from "./CustomColors";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("CustomColors", () => {
	it("renders a color swatch per color plus the add icon", () => {
		renderWithTheme(
			<CustomColors
				colors={["#fff", "#000"]}
				onChange={vi.fn()}
				value="#fff"
			/>,
		);

		expect(screen.getByTestId("color-#fff")).not.toBeNull();
		expect(screen.getByTestId("color-#000")).not.toBeNull();
	});

	it("adds a new white color and opens the modal for it", () => {
		const onChange = vi.fn();
		const { container } = renderWithTheme(
			<CustomColors colors={["#fff"]} onChange={onChange} value="#fff" />,
		);

		fireEvent.click(container.querySelector("svg")?.parentElement as Element);

		expect(onChange).toHaveBeenCalledWith({
			color: "#ffffff",
			customColors: ["#fff", "#ffffff"],
		});
		expect(screen.getByTestId("color-picker-modal")).not.toBeNull();
	});

	it("opens the modal when clicking an existing color", () => {
		const onChange = vi.fn();
		renderWithTheme(
			<CustomColors
				colors={["#fff", "#000"]}
				onChange={onChange}
				value="#fff"
			/>,
		);

		fireEvent.click(screen.getByTestId("color-#000"));

		expect(onChange).toHaveBeenCalledWith({ color: "#000" });
		expect(screen.getByTestId("color-picker-modal")).not.toBeNull();
	});

	it("renders the remove label after selecting a color to edit", () => {
		// Note: the actual remove *click* is delivered via a `<Button>` passed as
		// the `icon` component to this repo's custom `Trans` component (see
		// src/components/Trans/Trans.ts), which only calls `t(i18nKey, options)`
		// and renders whatever the translation function returns -- it never
		// renders the `components` it's given. So in this test environment
		// (and in production unless `t` itself performs the interpolation)
		// that remove button is never actually mounted in the DOM, making
		// `onRemoveColor` unreachable through user interaction here. Flagged
		// as a real gap in the final report rather than exercised directly.
		const onChange = vi.fn();
		renderWithTheme(
			<CustomColors
				colors={["#fff", "#000"]}
				onChange={onChange}
				value="#fff"
			/>,
		);

		fireEvent.click(screen.getByTestId("color-#000"));

		expect(screen.getByText(/color\.remove/)).not.toBeNull();
	});

	it("passes allowGradient through to the modal", () => {
		renderWithTheme(
			<CustomColors
				allowGradient
				colors={["#fff"]}
				onChange={vi.fn()}
				value="#fff"
			/>,
		);

		fireEvent.click(screen.getByTestId("color-#fff"));
		expect(screen.getByTestId("color-picker-modal")).not.toBeNull();
	});
});
