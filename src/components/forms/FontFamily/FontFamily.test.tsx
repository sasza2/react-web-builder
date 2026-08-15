import { render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const render = (ui: React.ReactElement) =>
	rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const mockUseWebBuilderProperties = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/components/PropertiesProvider/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

vi.mock("../Select", () => ({
	Select: ({ name }: { name: string }) => (
		<div data-testid="select">{name}</div>
	),
}));

import { FontFamily } from "./FontFamily";

describe("FontFamily", () => {
	it("returns null when fonts are missing", () => {
		mockUseWebBuilderProperties.mockReturnValue({ fonts: undefined });

		const { container } = render(<FontFamily />);

		expect(container.innerHTML).toBe("");
	});

	it("renders select with fonts", () => {
		mockUseWebBuilderProperties.mockReturnValue({
			fonts: [{ label: "Arial", value: "Arial" }],
		});

		render(<FontFamily />);

		expect(screen.getByTestId("select")).not.toBeNull();
	});
});
