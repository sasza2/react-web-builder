import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-tooltip", () => ({
	Tooltip: ({ children }: { children?: React.ReactNode }) => (
		<div>{children}</div>
	),
}));

import { StyleProvider } from "../StyleProvider";
import { SidebarHeader } from "./SidebarHeader";

describe("SidebarHeader", () => {
	it("renders children without a back button by default", () => {
		const { container } = render(
			<StyleProvider>
				<SidebarHeader>content</SidebarHeader>
			</StyleProvider>,
		);
		expect(screen.getByText("content")).not.toBeNull();
		expect(container.querySelector("button")).toBeNull();
	});

	it("renders a back button that calls onBack when clicked", () => {
		const onBack = vi.fn();
		const { container } = render(
			<StyleProvider>
				<SidebarHeader onBack={onBack}>content</SidebarHeader>
			</StyleProvider>,
		);
		const button = container.querySelector("button");
		expect(button).not.toBeNull();
		button.click();
		expect(onBack).toHaveBeenCalledTimes(1);
	});
});
