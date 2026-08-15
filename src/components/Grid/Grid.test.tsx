import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: vi.fn(),
}));

vi.mock("./BreakpointGrid", () => ({
	BreakpointGrid: () => <div data-testid="breakpoint-grid" />,
}));

import { useBreakpoint } from "@/hooks/useBreakpoint";

import { buildBreakpoint } from "@/testing/fixtures";

import { Grid } from "./Grid";

describe("Grid", () => {
	it("returns null when there is no breakpoint", () => {
		vi.mocked(useBreakpoint).mockReturnValue(null);
		const { container } = render(<Grid />);
		expect(container.innerHTML).toBe("");
	});

	it("returns null when breakpoint has no id", () => {
		vi.mocked(useBreakpoint).mockReturnValue(buildBreakpoint({ id: "" }));
		const { container } = render(<Grid />);
		expect(container.innerHTML).toBe("");
	});

	it("renders BreakpointGrid when breakpoint is present", () => {
		vi.mocked(useBreakpoint).mockReturnValue(
			buildBreakpoint({ id: "bp-1", from: 320 }),
		);
		const { getByTestId } = render(<Grid />);
		expect(getByTestId("breakpoint-grid")).not.toBeNull();
	});
});
