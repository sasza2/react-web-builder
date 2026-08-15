import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const mockUseWebBuilderProperties = vi.fn();

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

vi.mock("@/components/Button", () => ({
	LinkButton: ({ children }: React.PropsWithChildren) => (
		<button type="button" data-testid="link-button">
			{children}
		</button>
	),
}));

import { About } from "./About";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("About", () => {
	it("renders description when provided", () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		renderWithTheme(<About description="Some description" />);

		expect(screen.getByText("Some description")).not.toBeNull();
	});

	it("does not render description when absent", () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		renderWithTheme(<About description={undefined} />);

		expect(screen.queryByText("Some description")).toBeNull();
	});

	it("renders button when button.label provided and calls onAboutClick on click", () => {
		const onAboutClick = vi.fn();
		mockUseWebBuilderProperties.mockReturnValue({ onAboutClick });

		renderWithTheme(
			<About button={{ label: "Click me", url: "https://example.com" }} />,
		);

		expect(screen.getByText("Click me")).not.toBeNull();
		fireEvent.click(screen.getByTestId("link-button"));
		expect(onAboutClick).toHaveBeenCalledWith({
			label: "Click me",
			url: "https://example.com",
		});
	});

	it("does not render button when button.label absent", () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		renderWithTheme(<About button={{ label: "" }} />);

		expect(screen.queryByTestId("link-button")).toBeNull();
	});

	it("does not call onAboutClick when it is not provided", () => {
		mockUseWebBuilderProperties.mockReturnValue({});
		renderWithTheme(<About button={{ label: "Click me" }} />);

		fireEvent.click(screen.getByTestId("link-button"));
		expect(screen.getByText("Click me")).not.toBeNull();
	});
});
