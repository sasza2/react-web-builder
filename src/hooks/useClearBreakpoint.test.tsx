import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint, buildElement } from "@/testing/fixtures";

import { useClearBreakpoint } from "./useClearBreakpoint";

const wrapperFor =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

it("clears elements for the selected breakpoint", () => {
	const breakpoint = buildBreakpoint({ id: "bp-1" });
	const store = createStore({
		breakpoints: [breakpoint],
		selectedBreakpoint: "bp-1",
		elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
	});

	const { result } = renderHook(() => useClearBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current();
	});

	expect(store.getState().elementsInBreakpoints["bp-1"]).toEqual([]);
});

it("does nothing when there is no selected breakpoint", () => {
	const store = createStore({
		breakpoints: [],
		selectedBreakpoint: null,
		elementsInBreakpoints: {},
	});

	const { result } = renderHook(() => useClearBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	expect(() => {
		act(() => {
			result.current();
		});
	}).not.toThrow();

	expect(store.getState().elementsInBreakpoints).toEqual({});
});
