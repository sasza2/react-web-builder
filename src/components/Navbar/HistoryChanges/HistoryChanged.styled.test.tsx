import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import { Container } from "./HistoryChanged.styled";

describe("HistoryChanged.styled", () => {
	it("renders Container", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Container>content</Container>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
