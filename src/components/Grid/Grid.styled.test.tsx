import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import type { PageSettings } from "types";

import { buildBreakpoint } from "@/testing/fixtures";

import theme from "../StyleProvider/theme";
import { GRID_PADDING_WIDTH, GridDiv } from "./Grid.styled";

const breakpoint = buildBreakpoint({
	id: "bp-1",
	from: 320,
	padding: { top: 0, right: 10, bottom: 0, left: 5 },
});

const pageSettings: PageSettings = {};

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("GridDiv", () => {
	it("exports GRID_PADDING_WIDTH", () => {
		expect(GRID_PADDING_WIDTH).toBe(30);
	});

	it("renders with isLoaded=false, no fontImport, no selection", () => {
		const { container } = renderWithTheme(
			<GridDiv
				$breakpoint={breakpoint}
				$fontImport={null}
				$height={100}
				$isLoaded={false}
				$pageSettings={pageSettings}
			/>,
		);

		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders with isLoaded=true, fontImport, selectedElementId and selectedElements", () => {
		const { container } = renderWithTheme(
			<GridDiv
				$breakpoint={breakpoint}
				$fontImport={{ fontFamily: "Arial", value: "Arial", label: "Arial" }}
				$height={200}
				$isLoaded
				$pageSettings={pageSettings}
				$selectedElementId="el-1"
				$selectedElements={["el-1", "el-2"]}
			/>,
		);

		expect(container.querySelector("div")).not.toBeNull();
	});

	it("renders with empty selectedElements array (falsy map branch not triggered)", () => {
		const { container } = renderWithTheme(
			<GridDiv
				$breakpoint={breakpoint}
				$fontImport={null}
				$height={0}
				$isLoaded={false}
				$pageSettings={pageSettings}
				$selectedElements={[]}
			/>,
		);

		expect(container.querySelector("div")).not.toBeNull();
	});
});
