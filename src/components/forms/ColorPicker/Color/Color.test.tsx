import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

import { StyleProvider } from "@/components/StyleProvider";

import { Color } from "./Color";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Color", () => {
	it("renders a solid color swatch with a tooltip id set up", () => {
		const { container } = renderWithTheme(<Color color="#ff0000" />);

		const el = container.querySelector('[data-testid*="color"]');
		expect(el).not.toBeNull();
		expect(el.getAttribute("data-testid")).toContain("#ff0000");
		expect(el.getAttribute("data-tooltip-id")).not.toBeNull();
	});

	it("renders a gradient color swatch without a tooltip id in the testid", () => {
		const { container } = renderWithTheme(
			<Color color="linear-gradient(90deg, #fff 0%, #000 100%)" />,
		);

		const el = container.querySelector('[data-testid*="color"]');
		expect(el.getAttribute("data-testid")).toBe("color");
	});

	it("calls onClick when clicked", () => {
		const onClick = vi.fn();
		const { container } = renderWithTheme(
			<Color color="#ffffff" onClick={onClick} />,
		);

		(container.querySelector('[data-testid*="color"]') as HTMLElement).click();

		expect(onClick).toHaveBeenCalled();
	});

	it("supports the active and size props", () => {
		const { container } = renderWithTheme(
			<Color color="#ffffff" active size="lg" />,
		);
		expect(container.querySelector('[data-testid*="color"]')).not.toBeNull();
	});
});
