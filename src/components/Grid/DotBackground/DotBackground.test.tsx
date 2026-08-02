import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockGetBreakpointWidth = vi.fn();

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useGetBreakpointWidth", () => ({
	useGetBreakpointWidth: () => mockGetBreakpointWidth,
}));

vi.mock("styled-components", async () => {
	const actual =
		await vi.importActual<typeof import("styled-components")>(
			"styled-components",
		);
	return {
		...actual,
		useTheme: () => ({ colors: { black: "#000000" } }),
	};
});

import { DotBackground } from "./DotBackground";

describe("DotBackground", () => {
	it("draws the dot pattern onto a canvas and assigns it as background-image", () => {
		mockUseBreakpoint.mockReturnValue({ rowHeight: 50, cols: 4 });
		mockGetBreakpointWidth.mockReturnValue(400);

		const ctx = {
			beginPath: vi.fn(),
			arc: vi.fn(),
			stroke: vi.fn(),
		};
		const toDataURL = vi.fn(() => "data:image/png;base64,AAA");
		const getContextSpy = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(ctx as unknown as CanvasRenderingContext2D);
		const toDataURLSpy = vi
			.spyOn(HTMLCanvasElement.prototype, "toDataURL")
			.mockImplementation(toDataURL);

		const { container } = render(<DotBackground />);

		const div = container.firstChild as HTMLDivElement;
		expect(div).not.toBeNull();
		expect(div.style.backgroundImage).toContain("data:image/png;base64,AAA");
		expect(div.style.backgroundRepeat).toBe("repeat");
		expect(ctx.arc).toHaveBeenCalled();
		expect(ctx.stroke).toHaveBeenCalled();

		getContextSpy.mockRestore();
		toDataURLSpy.mockRestore();
	});

	it("does nothing when the canvas 2d context is unavailable", () => {
		mockUseBreakpoint.mockReturnValue({ rowHeight: 50, cols: 4 });
		mockGetBreakpointWidth.mockReturnValue(400);

		const getContextSpy = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);

		const { container } = render(<DotBackground />);

		const div = container.firstChild as HTMLDivElement;
		expect(div.style.backgroundImage).toBe("");

		getContextSpy.mockRestore();
	});

	it("does nothing when ref node is null (unmount)", () => {
		mockUseBreakpoint.mockReturnValue({ rowHeight: 50, cols: 4 });
		mockGetBreakpointWidth.mockReturnValue(400);

		const getContextSpy = vi
			.spyOn(HTMLCanvasElement.prototype, "getContext")
			.mockReturnValue(null);

		const { unmount } = render(<DotBackground />);

		expect(() => unmount()).not.toThrow();

		getContextSpy.mockRestore();
	});
});
