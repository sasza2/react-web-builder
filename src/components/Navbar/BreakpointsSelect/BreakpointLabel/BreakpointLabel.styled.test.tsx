import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";

import { Container, IconContainer } from "./BreakpointLabel.styled";

describe("BreakpointLabel.styled", () => {
	it("renders Container and IconContainer", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Container>
					<IconContainer>icon</IconContainer>
				</Container>
			</ThemeProvider>,
		);
		expect(container.querySelector("div")).not.toBeNull();
	});
});
