import { act, fireEvent, render, renderHook } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("./WebBuilderSize.styled", () => ({
	Container: React.forwardRef<
		HTMLDivElement,
		ComponentProps<typeof import("./WebBuilderSize.styled").Container>
	>((props, ref) => (
		<div ref={ref} data-testid="container" data-max-height={props.$maxHeight}>
			{props.children}
		</div>
	)),
}));

import {
	useWebBuilderNodeRef,
	useWebBuilderSize,
	useWebBuilderSizeHeight,
	useWebBuilderSizeWidth,
	WebBuilderSizeProvider,
} from "./WebBuilderSize";

describe("WebBuilderSize", () => {
	it("default context hook values outside provider", () => {
		const { result: heightResult } = renderHook(() =>
			useWebBuilderSizeHeight(),
		);
		const { result: widthResult } = renderHook(() => useWebBuilderSizeWidth());
		const { result: sizeResult } = renderHook(() => useWebBuilderSize());
		const { result: nodeRefResult } = renderHook(() => useWebBuilderNodeRef());

		expect(heightResult.current).toBe(0);
		expect(widthResult.current).toBe(0);
		expect(sizeResult.current).toEqual({ width: 0, height: 0 });
		expect(nodeRefResult.current).toEqual({ current: null });
	});

	it("renders children and computes size on init", () => {
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({
				top: 10,
				width: 200,
				height: 300,
			}) as DOMRect;

		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 800,
		});

		const { getByTestId, getByText } = render(
			<WebBuilderSizeProvider>
				<div>child-content</div>
			</WebBuilderSizeProvider>,
		);

		expect(getByText("child-content")).not.toBeNull();
		const container = getByTestId("container");
		expect(container.style.height).toBe("790px");

		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});

	it("provides size/height/width/nodeRef via consumer hooks", () => {
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({
				top: 0,
				width: 100,
				height: 400,
			}) as DOMRect;
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 500,
		});

		let capturedHeight: number;
		let capturedWidth: number;
		let capturedSize: { width: number; height: number };
		let capturedNodeRef: React.MutableRefObject<HTMLDivElement>;

		function Consumer() {
			capturedHeight = useWebBuilderSizeHeight();
			capturedWidth = useWebBuilderSizeWidth();
			capturedSize = useWebBuilderSize();
			capturedNodeRef = useWebBuilderNodeRef();
			return null;
		}

		render(
			<WebBuilderSizeProvider>
				<Consumer />
			</WebBuilderSizeProvider>,
		);

		expect(capturedHeight).toBe(500);
		expect(capturedWidth).toBe(100);
		expect(capturedSize).toEqual({ width: 100, height: 500 });
		expect(capturedNodeRef.current).not.toBeNull();

		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});

	it("resizes on window resize event", () => {
		let call = 0;
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () => {
			call += 1;
			return {
				top: 0,
				width: call === 1 ? 100 : 250,
				height: 400,
			} as DOMRect;
		};
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 500,
		});

		const { getByTestId } = render(
			<WebBuilderSizeProvider>
				<div>child</div>
			</WebBuilderSizeProvider>,
		);

		act(() => {
			fireEvent(window, new Event("resize"));
		});

		const container = getByTestId("container");
		expect(container.getAttribute("data-max-height")).toBe("500");

		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});

	it("prevents default on wheel event with ctrlKey", () => {
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({
				top: 0,
				width: 100,
				height: 400,
			}) as DOMRect;
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 500,
		});

		const { getByTestId } = render(
			<WebBuilderSizeProvider>
				<div>child</div>
			</WebBuilderSizeProvider>,
		);

		const container = getByTestId("container");
		const wheelEvent = new MouseEvent("wheel", {
			bubbles: true,
			cancelable: true,
		});
		Object.defineProperty(wheelEvent, "ctrlKey", { value: true });
		const preventDefaultSpy = vi.spyOn(wheelEvent, "preventDefault");

		fireEvent(container, wheelEvent);

		expect(preventDefaultSpy).toHaveBeenCalled();

		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});

	it("does not prevent default on wheel event without ctrlKey", () => {
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({
				top: 0,
				width: 100,
				height: 400,
			}) as DOMRect;
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 500,
		});

		const { getByTestId } = render(
			<WebBuilderSizeProvider>
				<div>child</div>
			</WebBuilderSizeProvider>,
		);

		const container = getByTestId("container");
		const wheelEvent = new MouseEvent("wheel", {
			bubbles: true,
			cancelable: true,
		});
		const preventDefaultSpy = vi.spyOn(wheelEvent, "preventDefault");

		fireEvent(container, wheelEvent);

		expect(preventDefaultSpy).not.toHaveBeenCalled();

		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});

	it("removes listeners on unmount", () => {
		const originalGetBCR = HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({
				top: 0,
				width: 100,
				height: 400,
			}) as DOMRect;
		Object.defineProperty(window, "innerHeight", {
			configurable: true,
			value: 500,
		});

		const removeSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = render(
			<WebBuilderSizeProvider>
				<div>child</div>
			</WebBuilderSizeProvider>,
		);

		unmount();

		expect(removeSpy).toHaveBeenCalledWith("resize", expect.any(Function));

		removeSpy.mockRestore();
		HTMLDivElement.prototype.getBoundingClientRect = originalGetBCR;
	});
});
