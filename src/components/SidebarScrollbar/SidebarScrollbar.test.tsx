import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderSizeHeight = vi.fn(() => 100);

vi.mock("../WebBuilderSize", () => ({
	useWebBuilderSizeHeight: () => mockUseWebBuilderSizeHeight(),
}));

vi.mock("@/components/Scrollbar", () => ({
	Scrollbar: ({ children }: { children?: React.ReactNode }) => (
		<div data-testid="scrollbar">{children}</div>
	),
}));

import { SidebarScrollbar } from "./SidebarScrollbar";

describe("SidebarScrollbar", () => {
	it("renders children wrapped in the Scrollbar", () => {
		render(
			<SidebarScrollbar>
				<span>child-content</span>
			</SidebarScrollbar>,
		);
		expect(screen.getByText("child-content")).not.toBeNull();
		expect(screen.getByTestId("scrollbar")).not.toBeNull();
	});
});
