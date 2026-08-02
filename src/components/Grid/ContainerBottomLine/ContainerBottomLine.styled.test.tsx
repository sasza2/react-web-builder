import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "@/components/StyleProvider/theme";

import { Line } from "./ContainerBottomLine.styled";

describe("ContainerBottomLine.styled", () => {
	it("renders with the given top prop", () => {
		const { container } = render(
			<ThemeProvider theme={theme}>
				<Line $top={100} />
			</ThemeProvider>,
		);

		expect(container.firstChild).not.toBeNull();
	});
});
