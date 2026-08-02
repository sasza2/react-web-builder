import { render } from "@testing-library/react";
import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseContainerGridStyle = vi.fn();
const mockUseGridAPI = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseElementsWithRender = vi.fn();
const mockUseContainerElementProperties = vi.fn();

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => mockUseGridAPI(),
}));

vi.mock("@/hooks/container/useContainerElementProperties", () => ({
	useContainerElementProperties: () => mockUseContainerElementProperties(),
}));

vi.mock("@/hooks/container/useContainerGridStyle", () => ({
	useContainerGridStyle: () => mockUseContainerGridStyle(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("../useElementsWithRender", () => ({
	default: () => mockUseElementsWithRender(),
}));

vi.mock("../ContainerBottomLine", () => ({
	ContainerBottomLine: ({ breakpoint }: { breakpoint: { id: string } }) => (
		<div data-testid="bottom-line">{breakpoint.id}</div>
	),
}));

import { ContainerBackground } from "./ContainerBackground";

describe("ContainerBackground", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseContainerGridStyle.mockReturnValue({});
		mockUsePageSettings.mockReturnValue({ backgroundColor: "#eee" });
		mockUseElementsWithRender.mockReturnValue([]);
		mockUseContainerElementProperties.mockReturnValue(undefined);
		mockUseGridAPI.mockReturnValue({
			current: {
				getLowestElementBottomInPixels: vi.fn(() => 123),
			},
		});
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns null when the current breakpoint is a real (non-container) breakpoint", () => {
		mockUseBreakpoint.mockReturnValue({ id: "bp1", parentId: null });

		const { container } = render(<ContainerBackground />);

		expect(container.firstChild).toBeNull();
	});

	it("renders the background container and bottom line when breakpoint is a container", () => {
		mockUseBreakpoint.mockReturnValue({ id: "bp1", parentId: "parent-1" });

		const { getByTestId } = render(<ContainerBackground />);

		expect(getByTestId("bottom-line")).not.toBeNull();
	});

	it("sets the container height from the grid API after a delay when breakpointHeight is not enabled", () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue({ id: "bp1", parentId: "parent-1" });
		mockUseContainerElementProperties.mockReturnValue({
			breakpointHeight: { enabled: false },
		});

		const { container } = render(<ContainerBackground />);
		const div = container.querySelector("div");

		vi.advanceTimersByTime(200);

		expect(div?.style.height).toBe("123px");
	});

	it("uses the explicit breakpointHeight.height as style height and does not schedule an update", () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue({ id: "bp1", parentId: "parent-1" });
		mockUseContainerElementProperties.mockReturnValue({
			breakpointHeight: { enabled: true, height: 456 },
		});
		const getLowestElementBottomInPixels = vi.fn(() => 999);
		mockUseGridAPI.mockReturnValue({
			current: { getLowestElementBottomInPixels },
		});

		render(<ContainerBackground />);

		vi.advanceTimersByTime(200);

		expect(getLowestElementBottomInPixels).not.toHaveBeenCalled();
	});

	it("clears the pending timer on unmount", () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue({ id: "bp1", parentId: "parent-1" });
		mockUseContainerElementProperties.mockReturnValue({
			breakpointHeight: { enabled: false },
		});

		const { unmount } = render(<ContainerBackground />);
		expect(() => unmount()).not.toThrow();
	});
});
