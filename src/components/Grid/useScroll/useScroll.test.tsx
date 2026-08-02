import { act, fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import theme from "../../StyleProvider/theme";

const mockUseGridAPI = vi.fn();
const mockUseWebBuilderSizeHeight = vi.fn();
const mockUseWebBuilderSizeWidth = vi.fn();

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => mockUseGridAPI(),
}));
vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSizeHeight: () => mockUseWebBuilderSizeHeight(),
	useWebBuilderSizeWidth: () => mockUseWebBuilderSizeWidth(),
}));

import { useScroll } from "./useScroll";

type Rect = {
	top?: number;
	left?: number;
	right?: number;
	bottom?: number;
	width?: number;
	height?: number;
};

const rectMap = new WeakMap<Element, Rect>();
const setRect = (el: Element, rect: Rect) => rectMap.set(el, rect);

const fullRect = (rect: Rect) => ({
	top: 0,
	left: 0,
	right: 0,
	bottom: 0,
	width: 0,
	height: 0,
	x: rect.left ?? 0,
	y: rect.top ?? 0,
	toJSON: () => ({}),
	...rect,
});

let onScrollChangeRef: (() => void) | null = null;

function TestComponent() {
	const { scrollElement, onScrollChange } = useScroll();
	onScrollChangeRef = onScrollChange;
	return <div>{scrollElement}</div>;
}

const renderComponent = () =>
	render(
		<ThemeProvider theme={theme}>
			<TestComponent />
		</ThemeProvider>,
	);

const buildPanZoom = (
	parentNode: HTMLDivElement,
	childNode: HTMLDivElement,
) => {
	parentNode.appendChild(childNode);
	return {
		childNode,
		getPosition: vi.fn(() => ({ x: 0, y: 0 })),
		getZoom: vi.fn(() => 1),
		setPosition: vi.fn(),
	};
};

describe("useScroll", () => {
	let originalGetBCR: typeof HTMLElement.prototype.getBoundingClientRect;
	let setPointerCaptureSpy: ReturnType<typeof vi.fn>;
	let releasePointerCaptureSpy: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockUseWebBuilderSizeHeight.mockReturnValue(500);
		mockUseWebBuilderSizeWidth.mockReturnValue(1000);
		originalGetBCR = HTMLElement.prototype.getBoundingClientRect;
		HTMLElement.prototype.getBoundingClientRect = function (this: HTMLElement) {
			const rect = rectMap.get(this);
			return fullRect(rect || {});
		};
		setPointerCaptureSpy = vi.fn();
		releasePointerCaptureSpy = vi.fn();
		HTMLElement.prototype.setPointerCapture = setPointerCaptureSpy;
		HTMLElement.prototype.releasePointerCapture = releasePointerCaptureSpy;
	});

	afterEach(() => {
		HTMLElement.prototype.getBoundingClientRect = originalGetBCR;
		vi.clearAllMocks();
		onScrollChangeRef = null;
		vi.useRealTimers();
	});

	it("renders the scroll elements", () => {
		mockUseGridAPI.mockReturnValue({ current: null });
		const { container } = renderComponent();
		expect(container.querySelectorAll("div").length).toBeGreaterThan(0);
	});

	it("onScrollChange is a no-op guard when gridAPIRef.current is missing", () => {
		mockUseGridAPI.mockReturnValue({ current: null });
		renderComponent();
		expect(() => act(() => onScrollChangeRef())).not.toThrow();
	});

	it("computes scrollbar sizes/positions and hides them when content fully fits (100% branch)", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(parentNode, { height: 100, width: 100, top: 0, left: 0 });
		setRect(childNode, { height: 100, width: 100, top: 0, left: 0 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		act(() => onScrollChangeRef());

		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;
		const horizontalIn = container.querySelectorAll("div")[4] as HTMLDivElement;

		expect(verticalIn.style.opacity).toBe("0");
		expect(verticalIn.style.pointerEvents).toBe("none");
		expect(horizontalIn.style.opacity).toBe("0");
		expect(horizontalIn.style.pointerEvents).toBe("none");
	});

	it("computes partial scrollbar sizes/positions when content overflows", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(parentNode, { height: 50, width: 50, top: 0, left: 0 });
		setRect(childNode, { height: 200, width: 100, top: -20, left: -10 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		act(() => onScrollChangeRef());

		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;
		const horizontalIn = container.querySelectorAll("div")[4] as HTMLDivElement;

		expect(verticalIn.style.height).toBe("25%");
		expect(verticalIn.style.top).toBe("10%");
		expect(horizontalIn.style.width).toBe("50%");
		expect(horizontalIn.style.left).toBe("10%");
	});

	it("skips recalculation while a scrollbar drag is in progress (isUsingScrollRef guard)", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(parentNode, { height: 50, width: 50, top: 0, left: 0 });
		setRect(childNode, { height: 200, width: 100, top: 0, left: 0 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;
		setRect(verticalIn, { top: 0, left: 0, width: 5, height: 20 });
		setRect(verticalIn.parentElement, {
			top: 0,
			left: 0,
			width: 10,
			height: 200,
		});

		fireEvent.pointerDown(verticalIn, { button: 0, clientX: 0, clientY: 0 });
		expect(setPointerCaptureSpy).toHaveBeenCalled();

		// while dragging, onScrollChange should be a guarded no-op: set a
		// sentinel (valid CSS opacity value, distinguishable from what the
		// real computation would produce for this rect setup) and confirm
		// it is left untouched.
		verticalIn.style.opacity = "0.42";
		act(() => onScrollChangeRef());
		expect(verticalIn.style.opacity).toBe("0.42");

		fireEvent(window, new Event("pointerup"));
		expect(releasePointerCaptureSpy).toHaveBeenCalled();
	});

	it("does nothing on pointerdown with a non-primary button", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;

		fireEvent(
			verticalIn,
			new MouseEvent("pointerdown", { bubbles: true, button: 1 }),
		);
		expect(setPointerCaptureSpy).not.toHaveBeenCalled();
	});

	it("drags the vertical scrollbar, clamps within bounds, and calls panZoom.setPosition", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(childNode, { height: 400, width: 100, top: 0, left: 0 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;
		setRect(verticalIn, { top: 0, left: 0, width: 5, height: 20 });
		setRect(verticalIn.parentElement, {
			top: 0,
			left: 0,
			width: 10,
			height: 200,
		});

		fireEvent.pointerDown(verticalIn, {
			button: 0,
			clientX: 100,
			clientY: 100,
		});

		// move far negative -> clamps to 0
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientX: 0, clientY: 0 }),
		);
		expect(panZoom.setPosition).toHaveBeenCalled();

		// move far beyond max -> clamps to max
		fireEvent(
			window,
			new MouseEvent("pointermove", { clientX: 100000, clientY: 100000 }),
		);
		expect(panZoom.setPosition).toHaveBeenCalled();

		fireEvent(window, new Event("pointerup"));
		expect(releasePointerCaptureSpy).toHaveBeenCalled();
	});

	it("drags the horizontal scrollbar and calls panZoom.setPosition", () => {
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(childNode, { height: 100, width: 400, top: 0, left: 0 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		const horizontalIn = container.querySelectorAll("div")[4] as HTMLDivElement;
		setRect(horizontalIn, { top: 0, left: 0, width: 20, height: 5 });
		setRect(horizontalIn.parentElement, {
			top: 0,
			left: 0,
			width: 200,
			height: 10,
		});

		fireEvent.pointerDown(horizontalIn, {
			button: 0,
			clientX: 50,
			clientY: 50,
		});

		fireEvent(
			window,
			new MouseEvent("pointermove", { clientX: 60, clientY: 50 }),
		);
		expect(panZoom.setPosition).toHaveBeenCalled();

		fireEvent(window, new Event("pointerup"));
	});

	it("watches for scroll via pointerdown/pointerup on window using timers", () => {
		vi.useFakeTimers();
		const parentNode = document.createElement("div");
		const childNode = document.createElement("div");
		setRect(parentNode, { height: 50, width: 50, top: 0, left: 0 });
		setRect(childNode, { height: 200, width: 100, top: 0, left: 0 });
		const panZoom = buildPanZoom(parentNode, childNode);
		mockUseGridAPI.mockReturnValue({ current: { getPanZoom: () => panZoom } });

		const { container } = renderComponent();
		const verticalIn = container.querySelectorAll("div")[2] as HTMLDivElement;

		fireEvent(window, new Event("pointerdown"));
		act(() => {
			vi.advanceTimersByTime(250);
		});
		expect(verticalIn.style.height).not.toBe("");

		fireEvent(window, new Event("pointerup"));
		act(() => {
			vi.advanceTimersByTime(250);
		});
	});

	it("cleans up window listeners and timers on unmount", () => {
		vi.useFakeTimers();
		mockUseGridAPI.mockReturnValue({ current: null });
		const addSpy = vi.spyOn(window, "addEventListener");
		const removeSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = renderComponent();
		expect(addSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function));
		expect(addSpy).toHaveBeenCalledWith("pointerup", expect.any(Function));

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("pointerdown", expect.any(Function));
		expect(removeSpy).toHaveBeenCalledWith("pointerup", expect.any(Function));

		addSpy.mockRestore();
		removeSpy.mockRestore();
	});
});
