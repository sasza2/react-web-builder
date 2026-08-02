import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import {
	AbsoluteContainer,
	Popup,
	PopupItem,
	Wrapper,
} from "./PublishButton.styled";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("PublishButton.styled", () => {
	it("renders AbsoluteContainer open/closed", () => {
		const { container, rerender } = renderWithTheme(
			<AbsoluteContainer $isOpen={false}>content</AbsoluteContainer>,
		);
		expect(container.querySelector("div")).not.toBeNull();
		rerender(
			<ThemeProvider theme={theme}>
				<AbsoluteContainer $isOpen>content</AbsoluteContainer>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Popup covering all opacity/visibility branches", () => {
		const combos: Array<[boolean, boolean]> = [
			[false, false],
			[false, true],
			[true, false],
			[true, true],
		];
		combos.forEach(([isOpen, isClosing]) => {
			const { container } = renderWithTheme(
				<Popup $isOpen={isOpen} $isClosing={isClosing}>
					content
				</Popup>,
			);
			expect(container.querySelector("div")).not.toBeNull();
		});
	});

	it("renders PopupItem", () => {
		const { container } = renderWithTheme(<PopupItem>item</PopupItem>);
		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders Wrapper", () => {
		const { container } = renderWithTheme(<Wrapper>wrapper</Wrapper>);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
