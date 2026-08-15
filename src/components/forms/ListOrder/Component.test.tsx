import { render as rtlRender, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import theme from "@/components/StyleProvider/theme";

import { Component, ROW_HEIGHT } from "./Component";

const render = (ui: React.ReactElement) =>
	rtlRender(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Component", () => {
	it("renders the label inside a ComponentBox using ROW_HEIGHT", () => {
		render(<Component label="Item label" />);

		expect(screen.getByText("Item label")).not.toBeNull();
		expect(ROW_HEIGHT).toBe(30);
	});
});
