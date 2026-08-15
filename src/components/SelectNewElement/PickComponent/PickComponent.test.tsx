import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

vi.mock("@/components/icons/Icon", () => ({
	Icon: Object.assign(
		({ icon }: { icon: string }) => <svg data-testid="icon">{icon}</svg>,
		{ QuestionMark: "QuestionMark" },
	),
}));

vi.mock("../../WhySeparatorTooltip", () => ({
	WhySeparatorTooltip: () => <div data-testid="why-separator-tooltip" />,
}));

import { PickComponent } from "./PickComponent";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("PickComponent", () => {
	it("renders the component label and icon, and calls onClick on mouse down for non-separator components", () => {
		const onClick = vi.fn();
		const component = { id: "Text", label: "Text label", icon: "TextIcon" };

		renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} />,
		);

		expect(screen.getByText("Text label")).not.toBeNull();
		expect(screen.getByTestId("icon")).not.toBeNull();

		fireEvent.mouseDown(screen.getByText("Text label").parentElement);

		expect(onClick).toHaveBeenCalled();
	});

	it("falls back to the component id as label and the question mark icon when missing", () => {
		const onClick = vi.fn();
		const component = { id: "Custom" };

		renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} />,
		);

		expect(screen.getByText("Custom")).not.toBeNull();
		expect(screen.getByTestId("icon").textContent).toBe("QuestionMark");
	});

	it("renders the WhySeparatorTooltip for the Separator component", () => {
		const onClick = vi.fn();
		const component = { id: "Separator", label: "Separator" };

		renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} />,
		);

		expect(screen.getByTestId("why-separator-tooltip")).not.toBeNull();
	});

	it("calls onClick when clicking a Separator outside of the tooltip container", () => {
		const onClick = vi.fn();
		const component = { id: "Separator", label: "Separator" };

		renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} />,
		);

		fireEvent.mouseDown(screen.getByText("Separator"));

		expect(onClick).toHaveBeenCalled();
	});

	it("does not call onClick when clicking inside the tooltip container of a Separator", () => {
		const onClick = vi.fn();
		const component = { id: "Separator", label: "Separator" };

		renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} />,
		);

		const tooltip = screen.getByTestId("why-separator-tooltip");
		fireEvent.mouseDown(tooltip);

		expect(onClick).not.toHaveBeenCalled();
	});

	it("applies active state styling", () => {
		const onClick = vi.fn();
		const component = { id: "Text", label: "Text" };

		const { container } = renderWithTheme(
			<PickComponent component={component as never} onClick={onClick} active />,
		);

		expect(container.querySelector('[data-id="component"]')).not.toBeNull();
	});
});
