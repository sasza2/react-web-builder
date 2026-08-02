import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import { Options, Wrapper } from "./Navbar.styled";

describe("Navbar.styled", () => {
	it("renders Wrapper", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Wrapper>content</Wrapper>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Options without $toLeft", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Options>content</Options>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Options with $toLeft", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Options $toLeft>content</Options>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
