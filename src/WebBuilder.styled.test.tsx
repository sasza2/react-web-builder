import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "@/components/StyleProvider";

import {
	GlobalStyles,
	PREVENT_ELEMENTS_TRANSITION_CLASS_NAME,
	PREVENT_USER_SELECT_CLASS_NAME,
} from "./WebBuilder.styled";

describe("WebBuilder.styled", () => {
	it("exports the expected class name constants", () => {
		expect(PREVENT_ELEMENTS_TRANSITION_CLASS_NAME).toBe(
			"react-web-builder-prevent-elements-transition",
		);
		expect(PREVENT_USER_SELECT_CLASS_NAME).toBe(
			"react-web-builder-prevent-user-select",
		);
	});

	it("renders global styles without throwing, evaluating theme-based rules", () => {
		const { container } = render(
			<StyleProvider>
				<GlobalStyles />
			</StyleProvider>,
		);

		// createGlobalStyle injects styles as a side effect (via CSSOM rather
		// than a readable <style> text node under styled-components v6 +
		// jsdom), so there's nothing meaningful to assert on in the DOM here.
		// This test's real purpose is to exercise (and cover) the theme
		// interpolation functions above without throwing.
		expect(container).not.toBeNull();
	});
});
