import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint, buildElement } from "@/testing/fixtures";

import { useGetBreakpointWidth } from "./useGetBreakpointWidth";

const wrapperFor =
	(preloadedState: Parameters<typeof createStore>[0]) =>
	({ children }: PropsWithChildren) => {
		const store = createStore(preloadedState);
		return <Provider store={store}>{children}</Provider>;
	};

it("returns from minus padding for a non-container breakpoint", () => {
	const breakpoint = buildBreakpoint({
		id: "bp-1",
		from: 1000,
		padding: { top: 0, bottom: 0, left: 10, right: 20 },
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [breakpoint],
			elementsInBreakpoints: {},
		}),
	});

	expect(result.current(breakpoint)).toBe(1000 - 10 - 20);
});

it("returns 0 for a container breakpoint whose parent cannot be found", () => {
	const breakpoint = buildBreakpoint({
		id: "bp-child",
		parentId: "missing-parent",
		from: 500,
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [breakpoint],
			elementsInBreakpoints: {},
		}),
	});

	expect(result.current(breakpoint)).toBe(0);
});

it("returns breakpoint.from when the parent has no entry in elementsInBreakpoints", () => {
	const parent = buildBreakpoint({ id: "parent", from: 1000 });
	const child = buildBreakpoint({
		id: "bp-child",
		parentId: "parent",
		from: 500,
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [parent, child],
			elementsInBreakpoints: {},
		}),
	});

	expect(result.current(child)).toBe(500);
});

it("returns breakpoint.from when parent exists but no container element references it", () => {
	const parent = buildBreakpoint({ id: "parent", from: 1000 });
	const child = buildBreakpoint({
		id: "bp-child",
		parentId: "parent",
		from: 500,
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [parent, child],
			elementsInBreakpoints: { parent: [] },
		}),
	});

	expect(result.current(child)).toBe(500);
});

it("computes width from the container element's width proportion of the parent", () => {
	const parent = buildBreakpoint({ id: "parent", from: 1200 });
	const child = buildBreakpoint({
		id: "bp-child",
		parentId: "parent",
		from: 500,
		padding: { top: 0, bottom: 0, left: 5, right: 5 },
	});

	const containerElement = buildElement({
		id: "el-1",
		w: 6,
		props: [{ propId: "containerId", value: "bp-child" }],
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [parent, child],
			elementsInBreakpoints: { parent: [containerElement] },
		}),
	});

	// parentWidth (recursive, parent has no parentId => 1200 - 0 - 0 = 1200)
	// (6 / 12) * 1200 - 5 - 5 = 590
	expect(result.current(child)).toBe(590);
});

it("skips elements that have no containerId prop at all", () => {
	const parent = buildBreakpoint({ id: "parent", from: 1200 });
	const child = buildBreakpoint({
		id: "bp-child",
		parentId: "parent",
		from: 500,
	});

	const elementWithoutContainerId = buildElement({
		id: "el-3",
		w: 6,
		props: [],
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [parent, child],
			elementsInBreakpoints: { parent: [elementWithoutContainerId] },
		}),
	});

	expect(result.current(child)).toBe(500);
});

it("skips elements whose containerId does not match the breakpoint id", () => {
	const parent = buildBreakpoint({ id: "parent", from: 1200 });
	const child = buildBreakpoint({
		id: "bp-child",
		parentId: "parent",
		from: 500,
	});

	const otherElement = buildElement({
		id: "el-2",
		w: 6,
		props: [{ propId: "containerId", value: "other-breakpoint" }],
	});

	const { result } = renderHook(() => useGetBreakpointWidth(), {
		wrapper: wrapperFor({
			breakpoints: [parent, child],
			elementsInBreakpoints: { parent: [otherElement] },
		}),
	});

	expect(result.current(child)).toBe(500);
});
