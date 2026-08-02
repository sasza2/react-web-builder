import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/icons/Padding", () => ({
	Padding: ({ rotate }: { rotate?: number }) => (
		<div data-testid="padding-icon">{rotate ?? 0}</div>
	),
}));

vi.mock("../ColorPicker", () => ({
	ColorPicker: ({ name }: { name: string }) => (
		<div data-testid={`color-picker-${name}`} />
	),
}));

vi.mock("../Input", () => ({
	Input: ({ name, leftNode }: { name: string; leftNode?: React.ReactNode }) => (
		<div data-testid={`input-${name}`}>{leftNode}</div>
	),
}));

vi.mock("../RangeSlider", () => ({
	RangeSlider: ({ name }: { name: string }) => (
		<div data-testid={`range-slider-${name}`} />
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { Border } from "./Border";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Border", () => {
	it("renders all sub-fields", () => {
		renderWithTheme(<Border name="border" />);

		expect(screen.getByText("element.border.name")).not.toBeNull();
		expect(screen.getByTestId("input-border.left")).not.toBeNull();
		expect(screen.getByTestId("input-border.top")).not.toBeNull();
		expect(screen.getByTestId("input-border.right")).not.toBeNull();
		expect(screen.getByTestId("input-border.bottom")).not.toBeNull();
		expect(screen.getByTestId("range-slider-border.radius")).not.toBeNull();
		expect(screen.getByTestId("color-picker-border.color")).not.toBeNull();
		expect(screen.getAllByTestId("padding-icon").length).toBe(4);
	});

	it("supports testId prop", () => {
		const { container } = renderWithTheme(<Border name="border" testId="b" />);
		expect(
			container.querySelector('[data-testid*="border"][data-testid*="b"]'),
		).not.toBeNull();
	});
});
