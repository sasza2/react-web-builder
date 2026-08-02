import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import { Container, Disabled } from "./BreakpointSelect.styled";

describe("BreakpointSelect.styled", () => {
	it("renders Container", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Container>content</Container>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Container with $disabled", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Container $disabled>content</Container>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Disabled", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Disabled />
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
