import { render } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseElements = vi.fn();
const mockUseSidebarWidth = vi.fn();
const mockUseWebBuilderSizeWidth = vi.fn();
const mockGetBreakpointWidth = vi.fn();
const mockGetBreakpointPadding = vi.fn();

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => gridAPIRef,
}));

vi.mock("@/components/SidebarProvider", () => ({
	useSidebarWidth: () => mockUseSidebarWidth(),
}));

vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSizeWidth: () => mockUseWebBuilderSizeWidth(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockUseElements(),
}));

vi.mock("@/hooks/useGetBreakpointWidth", () => ({
	useGetBreakpointWidth: () => mockGetBreakpointWidth,
}));

vi.mock("@/utils/breakpoint", () => ({
	getBreakpointPadding: (...args: unknown[]) =>
		mockGetBreakpointPadding(...args),
}));

let panZoomPosition = { x: 100, y: 200 };
const setPosition = vi.fn();
const getPosition = vi.fn(() => panZoomPosition);
const getZoom = vi.fn(() => 2);
let panZoomElements: Record<string, { position: { x: number; y: number } }> =
	{};
const getElements = vi.fn(() => panZoomElements);

const panZoom = { getPosition, setPosition, getZoom, getElements };
const getPanZoom = vi.fn(() => panZoom);
const gridAPIRef = { current: { getPanZoom } };

import { KeyboardEvents } from "./KeyboardEvents";

describe("KeyboardEvents", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		panZoomPosition = { x: 100, y: 200 };
		panZoomElements = {
			a: { position: { x: 1, y: 2 } },
			b: { position: { x: 3, y: 4 } },
			c: { position: { x: 5, y: 6 } },
		};
		getPosition.mockImplementation(() => panZoomPosition);
		getElements.mockImplementation(() => panZoomElements);
		mockUseBreakpoint.mockReturnValue({ id: "bp1", cols: 12 });
		mockUseElements.mockReturnValue({
			elements: [
				{ id: "a", x: 0, y: 0 },
				{ id: "b", x: 10, y: 0 },
				{ id: "c", x: 0, y: 20 },
			],
		});
		mockUseSidebarWidth.mockReturnValue(200);
		mockUseWebBuilderSizeWidth.mockReturnValue(1000);
		mockGetBreakpointWidth.mockReturnValue(500);
		mockGetBreakpointPadding.mockReturnValue({
			top: 0,
			right: 5,
			bottom: 0,
			left: 10,
		});
	});

	it("renders null", () => {
		const { container } = render(<KeyboardEvents />);
		expect(container.firstChild).toBeNull();
	});

	it("ignores keydown when document.body is not the active element", () => {
		render(<KeyboardEvents />);
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));

		expect(setPosition).not.toHaveBeenCalled();
		document.body.removeChild(input);
	});

	it("ignores keys that are not registered", () => {
		render(<KeyboardEvents />);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "KeyA" }));

		expect(getPanZoom).not.toHaveBeenCalled();
	});

	it("pans the grid on arrow key presses", () => {
		render(<KeyboardEvents />);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "ArrowUp" }));

		expect(setPosition).toHaveBeenCalledWith(100, 220);
	});

	it("moves focus to the first sorted element on first Tab press", () => {
		render(<KeyboardEvents />);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" }));

		// sortedElements[0] is "a" (y0,x0); expected computed position:
		// panZoomChildWidth = (500-10-5)*2 = 970 >= webBuilderWidth(770) -> center = 0
		// x = 0 - 1*2 = -2; y = -2*2 = -4
		expect(setPosition).toHaveBeenCalledWith(-2, -4);
	});

	it("moves focus forward through sorted elements on repeated Tab presses, wrapping when no next element matches", () => {
		render(<KeyboardEvents />);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" })); // -> a
		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" })); // -> b
		expect(setPosition).toHaveBeenLastCalledWith(-6, -8);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" })); // -> c
		expect(setPosition).toHaveBeenLastCalledWith(-10, -12);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" })); // wraps -> a
		expect(setPosition).toHaveBeenLastCalledWith(-2, -4);
	});

	it("moves focus backward through sorted elements on shift+Tab", () => {
		render(<KeyboardEvents />);

		window.dispatchEvent(
			new KeyboardEvent("keydown", { code: "Tab", shiftKey: true }),
		);

		// reversed sortedElements[0] is "c" (y20,x0)
		expect(setPosition).toHaveBeenCalledWith(-10, -12);

		window.dispatchEvent(
			new KeyboardEvent("keydown", { code: "Tab", shiftKey: true }),
		);
		// next reversed match should be "b"
		expect(setPosition).toHaveBeenLastCalledWith(-6, -8);
	});

	it("does nothing on Tab when there are no elements", () => {
		mockUseElements.mockReturnValue({ elements: [] });
		render(<KeyboardEvents />);

		window.dispatchEvent(new KeyboardEvent("keydown", { code: "Tab" }));

		expect(setPosition).not.toHaveBeenCalled();
	});

	it("moves focus backward to a same-row element with a smaller x on shift+Tab", () => {
		mockUseElements.mockReturnValue({
			elements: [
				{ id: "a", x: 0, y: 0 },
				{ id: "b", x: 10, y: 0 },
			],
		});

		render(<KeyboardEvents />);

		// reversed sortedElements[0] is "b" (y0,x10)
		window.dispatchEvent(
			new KeyboardEvent("keydown", { code: "Tab", shiftKey: true }),
		);
		expect(setPosition).toHaveBeenLastCalledWith(-6, -8);

		// same-y, smaller-x match should pick "a"
		window.dispatchEvent(
			new KeyboardEvent("keydown", { code: "Tab", shiftKey: true }),
		);
		expect(setPosition).toHaveBeenLastCalledWith(-2, -4);
	});

	it("removes the keydown listener on unmount", () => {
		const removeSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = render(<KeyboardEvents />);

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));
		removeSpy.mockRestore();
	});
});
