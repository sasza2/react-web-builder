import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { usePopup } from "./usePopup";

describe("usePopup", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("starts with no position and not closing", () => {
		const { result } = renderHook(() => usePopup());

		expect(result.current.position).toBeNull();
		expect(result.current.closing).toBe(false);
	});

	it("onOpen sets position based on the button's bounding rect", () => {
		const { result } = renderHook(() => usePopup());

		const rect = { left: 10, top: 20 } as DOMRect;
		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => rect },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		expect(result.current.position).toEqual({ left: 10, top: 20 });
	});

	it("onOpen when already open just clears closing", () => {
		const { result } = renderHook(() => usePopup());

		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});
		act(() => {
			result.current.setPosition({ left: 1, top: 2 });
		});

		act(() => {
			result.current.onOpen();
		});

		expect(result.current.closing).toBe(false);
	});

	it("close resets the position", () => {
		const { result } = renderHook(() => usePopup());

		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		act(() => {
			result.current.close();
		});

		expect(result.current.position).toBeNull();
	});

	it("clicking outside the popup closes it after the timeout", () => {
		const { result } = renderHook(() => usePopup());

		const popupNode = document.createElement("div");
		Object.defineProperty(result.current.popupRef, "current", {
			value: popupNode,
			writable: true,
		});
		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		const outsideNode = document.createElement("div");
		document.body.appendChild(outsideNode);

		act(() => {
			const evt = new MouseEvent("pointerdown");
			Object.defineProperty(evt, "target", { value: outsideNode });
			window.dispatchEvent(evt);
		});

		expect(result.current.closing).toBe(true);

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(result.current.position).toBeNull();
		expect(result.current.closing).toBe(false);
	});

	it("clicking inside the popup does not close it", () => {
		const { result } = renderHook(() => usePopup());

		const popupNode = document.createElement("div");
		const insideNode = document.createElement("span");
		popupNode.appendChild(insideNode);

		Object.defineProperty(result.current.popupRef, "current", {
			value: popupNode,
			writable: true,
		});
		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		act(() => {
			const evt = new MouseEvent("pointerdown");
			Object.defineProperty(evt, "target", { value: insideNode });
			window.dispatchEvent(evt);
		});

		expect(result.current.closing).toBe(false);
	});

	it("ignores clicks when the event target is null", () => {
		const { result } = renderHook(() => usePopup());

		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		expect(() => {
			act(() => {
				const evt = new MouseEvent("pointerdown");
				Object.defineProperty(evt, "target", { value: null });
				window.dispatchEvent(evt);
			});
		}).not.toThrow();
	});

	it("cleans up the listener and skips the delayed close on unmount", () => {
		const { result, unmount } = renderHook(() => usePopup());

		const popupNode = document.createElement("div");
		Object.defineProperty(result.current.popupRef, "current", {
			value: popupNode,
			writable: true,
		});
		Object.defineProperty(result.current.buttonRef, "current", {
			value: { getBoundingClientRect: () => ({ left: 1, top: 2 }) },
			writable: true,
		});

		act(() => {
			result.current.onOpen();
		});

		const outsideNode = document.createElement("div");

		act(() => {
			const evt = new MouseEvent("pointerdown");
			Object.defineProperty(evt, "target", { value: outsideNode });
			window.dispatchEvent(evt);
		});

		unmount();

		expect(() => {
			act(() => {
				vi.advanceTimersByTime(300);
			});
		}).not.toThrow();
	});
});
