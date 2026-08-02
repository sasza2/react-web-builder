import { render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import { BreakpointLabel } from "./BreakpointLabel";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("BreakpointLabel", () => {
	it("renders the AddBreakpoint icon when width is undefined", () => {
		const { container } = renderWithTheme(
			<BreakpointLabel label="Add breakpoint" testId="add" />,
		);
		expect(screen.getByText("Add breakpoint")).not.toBeNull();
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders the Mobile icon when width < 768", () => {
		const { container } = renderWithTheme(
			<BreakpointLabel label="Mobile" width={320} />,
		);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders the Tablet icon when width is between 768 and 1280", () => {
		const { container } = renderWithTheme(
			<BreakpointLabel label="Tablet" width={900} />,
		);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders the Desktop icon when width >= 1280", () => {
		const { container } = renderWithTheme(
			<BreakpointLabel label="Desktop" width={1440} />,
		);
		expect(container.querySelector("svg")).not.toBeNull();
	});

	it("renders without a testId", () => {
		const { container } = renderWithTheme(
			<BreakpointLabel label="No test id" width={100} />,
		);
		expect(container.querySelector("[data-testid]")).toBeNull();
	});
});
