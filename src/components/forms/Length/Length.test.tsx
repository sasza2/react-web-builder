import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "@/components/StyleProvider/theme";

vi.mock("../Input", () => ({
	Input: ({ name }: { name: string }) => <div data-testid={`input-${name}`} />,
}));

vi.mock("../Tabs", () => ({
	Tabs: ({ name, items }: { name: string; items: string[] }) => (
		<div data-testid={`tabs-${name}`}>{items.join(",")}</div>
	),
}));

import { Length } from "./Length";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Length", () => {
	it("renders labels, inputs, and tabs for each option", () => {
		renderWithTheme(
			<Length
				options={[
					{ name: "width", label: "Width" },
					{ name: "height", label: "Height" },
				]}
			/>,
		);

		expect(screen.getByText("Width:")).not.toBeNull();
		expect(screen.getByText("Height:")).not.toBeNull();
		expect(screen.getByTestId("input-width.value")).not.toBeNull();
		expect(screen.getByTestId("input-height.value")).not.toBeNull();
		expect(screen.getByTestId("tabs-width.unit").textContent).toBe("px,%");
		expect(screen.getByTestId("tabs-height.unit").textContent).toBe("px,%");
	});

	it("renders without label text when option has no label", () => {
		renderWithTheme(<Length options={[{ name: "width" }]} />);

		expect(screen.getByText(":")).not.toBeNull();
		expect(screen.getByTestId("input-width.value")).not.toBeNull();
	});

	it("renders nothing when options is empty", () => {
		const { container } = renderWithTheme(<Length options={[]} />);

		expect(container.querySelectorAll('[data-testid^="input-"]').length).toBe(
			0,
		);
	});
});
