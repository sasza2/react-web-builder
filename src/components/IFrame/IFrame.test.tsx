import { render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "../StyleProvider/theme";

vi.mock("../View/Box/useBoxStyle", () => ({
	useBoxStyle: vi.fn(() => ({ padding: "1px" })),
}));

import { IFrame } from "./IFrame";

const element = { id: "iframe-1" } as never;

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("IFrame", () => {
	it("renders an iframe with src location when src is provided", () => {
		const { container } = renderWithTheme(
			<IFrame
				element={element}
				height={200}
				src={{ location: "https://example.com" } as never}
			/>,
		);

		const iframe = container.querySelector("iframe");
		expect(iframe).not.toBeNull();
		expect(iframe?.getAttribute("src")).toBe("https://example.com");
		expect(iframe?.getAttribute("title")).toBe("web builder iframe-1");
	});

	it("renders Empty placeholder when src is not provided", () => {
		const { container } = renderWithTheme(
			<IFrame element={element} height={200} />,
		);

		expect(container.querySelector("iframe")).toBeNull();
	});
});
