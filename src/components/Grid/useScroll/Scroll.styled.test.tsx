import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "../../StyleProvider/theme";
import {
	ScrollHorizontal,
	ScrollHorizontalIn,
	ScrollVertical,
	ScrollVerticalIn,
} from "./Scroll.styled";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Scroll.styled", () => {
	it("renders ScrollVertical/ScrollHorizontal and their inner scrollbars", () => {
		const { container } = renderWithTheme(
			<>
				<ScrollVertical>
					<ScrollVerticalIn />
				</ScrollVertical>
				<ScrollHorizontal>
					<ScrollHorizontalIn />
				</ScrollHorizontal>
			</>,
		);

		expect(container.querySelectorAll("div").length).toBe(4);
	});
});
