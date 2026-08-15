import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { describe, expect, it } from "vitest";

import type { Breakpoint } from "types";

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { BuilderElementAnchor } from "./BuilderElementAnchor";

function renderWithStore(breakpoint: Breakpoint | null) {
	const store = createStore({
		breakpoints: breakpoint ? [breakpoint] : [],
		selectedBreakpoint: breakpoint ? breakpoint.id : null,
	});

	return render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<BuilderElementAnchor anchorId="el-1" />
			</ThemeProvider>
		</Provider>,
	);
}

describe("BuilderElementAnchor", () => {
	it("renders the anchor id text", () => {
		const { getByText } = renderWithStore(
			buildBreakpoint({ id: "bp-1", rowHeight: 40 }),
		);

		expect(getByText("#el-1")).not.toBeNull();
	});

	it("uses the breakpoint's rowHeight when a breakpoint is selected", () => {
		const { container } = renderWithStore(
			buildBreakpoint({ id: "bp-1", rowHeight: 40 }),
		);

		const wrapper = container.firstChild as HTMLElement;
		expect(getComputedStyle(wrapper).height).toBe("40px");
	});

	it("falls back to 0 when there is no selected breakpoint", () => {
		const { container } = renderWithStore(null);

		const wrapper = container.firstChild as HTMLElement;
		expect(getComputedStyle(wrapper).height).toBe("0px");
	});
});
