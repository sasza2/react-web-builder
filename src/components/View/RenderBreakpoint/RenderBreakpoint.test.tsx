import { render, screen } from "@testing-library/react";
import React from "react";
import type { Breakpoint } from "types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { RenderBreakpoint } from "./RenderBreakpoint";

const BREAKPOINT = {
	id: "bp-1",
	from: 100,
	to: 500,
	rowHeight: 10,
	padding: { top: 1, right: 2, bottom: 3, left: 4 },
} as unknown as Breakpoint;

let observeMock: ReturnType<typeof vi.fn>;
let disconnectMock: ReturnType<typeof vi.fn>;
let resizeCallback: (() => void) | undefined;

beforeEach(() => {
	observeMock = vi.fn();
	disconnectMock = vi.fn();
	resizeCallback = undefined;

	class MockResizeObserver {
		constructor(callback: () => void) {
			resizeCallback = callback;
		}
		observe = observeMock;
		disconnect = disconnectMock;
		unobserve = vi.fn();
	}

	vi.stubGlobal("ResizeObserver", MockResizeObserver);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("RenderBreakpoint", () => {
	it("renders children inside a div with computed padding/data-test-id", () => {
		render(
			<RenderBreakpoint breakpoint={BREAKPOINT}>
				<span>content</span>
			</RenderBreakpoint>,
		);

		expect(screen.getByText("content")).not.toBeNull();
		const target = document.querySelector("[data-test-id='breakpoint-bp-1']");
		expect(target).not.toBeNull();
		expect((target as HTMLElement).style.paddingTop).toBe("1px");
		expect((target as HTMLElement).style.paddingLeft).toBe("4px");
	});

	it("applies className prop", () => {
		render(
			<RenderBreakpoint breakpoint={BREAKPOINT} className="my-class">
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector("[data-test-id='breakpoint-bp-1']");
		expect(target?.className).toBe("my-class");
	});

	it("sets minWidth based on window.innerWidth when hasMinWidth is true", () => {
		const originalInnerWidth = window.innerWidth;
		Object.defineProperty(window, "innerWidth", {
			value: 200,
			configurable: true,
		});

		render(
			<RenderBreakpoint breakpoint={BREAKPOINT} hasMinWidth>
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector(
			"[data-test-id='breakpoint-bp-1']",
		) as HTMLElement;
		expect(target.style.minWidth).toBe("100px");

		Object.defineProperty(window, "innerWidth", {
			value: originalInnerWidth,
			configurable: true,
		});
	});

	it("leaves minWidth unset when window.innerWidth is below breakpoint.from", () => {
		const originalInnerWidth = window.innerWidth;
		Object.defineProperty(window, "innerWidth", {
			value: 50,
			configurable: true,
		});

		render(
			<RenderBreakpoint breakpoint={BREAKPOINT} hasMinWidth>
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector(
			"[data-test-id='breakpoint-bp-1']",
		) as HTMLElement;
		expect(target.style.minWidth).toBe("");

		Object.defineProperty(window, "innerWidth", {
			value: originalInnerWidth,
			configurable: true,
		});
	});

	it("does not set minWidth when hasMinWidth is false", () => {
		render(
			<RenderBreakpoint breakpoint={BREAKPOINT} hasMinWidth={false}>
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector(
			"[data-test-id='breakpoint-bp-1']",
		) as HTMLElement;
		expect(target.style.minWidth).toBe("");
	});

	it("leaves maxWidth unset when breakpoint.to is null", () => {
		render(
			<RenderBreakpoint breakpoint={{ ...BREAKPOINT, to: null }}>
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector(
			"[data-test-id='breakpoint-bp-1']",
		) as HTMLElement;
		expect(target.style.maxWidth).toBe("");
	});

	it("observes the ref via ResizeObserver and disconnects it on unmount", () => {
		const { unmount } = render(
			<RenderBreakpoint breakpoint={BREAKPOINT}>
				<span>content</span>
			</RenderBreakpoint>,
		);

		expect(observeMock).toHaveBeenCalled();

		unmount();

		expect(disconnectMock).toHaveBeenCalled();
	});

	it("recomputes breakpoint width/scale CSS vars when the observer fires", () => {
		vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
			cb(0);
			return 1;
		});
		vi.stubGlobal("cancelAnimationFrame", vi.fn());

		render(
			<RenderBreakpoint breakpoint={BREAKPOINT}>
				<span>content</span>
			</RenderBreakpoint>,
		);

		const target = document.querySelector(
			"[data-test-id='breakpoint-bp-1']",
		) as HTMLElement;

		Object.defineProperty(target, "clientWidth", {
			value: 300,
			configurable: true,
		});

		// Fire the observer callback twice in a row to cover the
		// cancelAnimationFrame(rafId) branch inside onResize.
		resizeCallback?.();
		resizeCallback?.();

		expect(target.style.getPropertyValue("--breakpoint-width")).toBe("294px");
	});
});
