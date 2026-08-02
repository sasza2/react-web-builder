import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "@/components/StyleProvider/theme";

import { Container } from "./ContainerBackground.styled";

describe("ContainerBackground.styled", () => {
	it("renders with the given background prop", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Container $background="red" data-testid="container" />
			</ThemeProvider>,
		);

		expect(container.firstChild).not.toBeNull();
	});
});
