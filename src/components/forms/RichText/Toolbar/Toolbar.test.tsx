import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { StyleProvider } from "@/components/StyleProvider";

import { Menu, Toolbar } from "./Toolbar";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Toolbar", () => {
	it("Menu renders children with a data-test-id", () => {
		const ref = React.createRef<HTMLDivElement>();
		const { container } = renderWithTheme(
			<Menu className="c" ref={ref}>
				menu-content
			</Menu>,
		);
		expect(screen.getByText("menu-content")).not.toBeNull();
		expect(container.querySelector('[data-test-id="menu"]')).not.toBeNull();
		expect(ref.current).not.toBeNull();
	});

	it("Toolbar renders children with a forwarded ref", () => {
		const ref = React.createRef<HTMLDivElement>();
		renderWithTheme(
			<Toolbar className="c" ref={ref}>
				toolbar-content
			</Toolbar>,
		);
		expect(screen.getByText("toolbar-content")).not.toBeNull();
		expect(ref.current).not.toBeNull();
	});
});
