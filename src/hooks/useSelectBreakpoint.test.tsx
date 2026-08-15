import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useSelectBreakpoint } from "./useSelectBreakpoint";

const wrapperFor =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

it("selects an existing breakpoint by id", () => {
	const breakpoint = buildBreakpoint({ id: "bp-1" });
	const store = createStore({
		breakpoints: [breakpoint],
		selectedBreakpoint: null,
	});

	const { result } = renderHook(() => useSelectBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current("bp-1");
	});

	expect(store.getState().selectedBreakpoint).toBe("bp-1");
});

it("dispatches with id: null when the breakpoint is not found", () => {
	const store = createStore({ breakpoints: [], selectedBreakpoint: "bp-1" });

	const { result } = renderHook(() => useSelectBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current("missing");
	});

	expect(store.getState().selectedBreakpoint).toBeNull();
});

it("handles a null breakpointId argument", () => {
	const store = createStore({ breakpoints: [], selectedBreakpoint: "bp-1" });

	const { result } = renderHook(() => useSelectBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	act(() => {
		result.current(null);
	});

	expect(store.getState().selectedBreakpoint).toBeNull();
});
