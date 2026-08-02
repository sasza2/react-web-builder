import { render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

vi.mock("react-toastify", () => ({
	ToastContainer: (
		props: ComponentProps<typeof import("react-toastify").ToastContainer>,
	) => <div data-testid="lib-toast-container" data-position={props.position} />,
}));

import { ToastContainer } from "./ToastContainer";

describe("ToastContainer", () => {
	it("renders the lib toast container with position top-center", () => {
		const { getByTestId } = render(
			<ThemeProvider theme={theme}>
				<ToastContainer />
			</ThemeProvider>,
		);

		const node = getByTestId("lib-toast-container");
		expect(node.getAttribute("data-position")).toBe("top-center");
	});
});
