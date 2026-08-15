import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it, vi } from "vitest";

import type { Breakpoint } from "types";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useAddBreakpoint } from "./useAddBreakpoint";

vi.mock("@/utils/createUniqueId", () => ({
	createUniqueId: () => "unique-id",
}));

const wrapperFor =
	(store: ReturnType<typeof createStore>) =>
	({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

it("adds a breakpoint with a generated id (non-silent)", () => {
	const store = createStore({ breakpoints: [] });

	const { result } = renderHook(() => useAddBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	const breakpointWithoutId: Omit<Breakpoint, "id"> = buildBreakpoint({
		from: 100,
	});

	let created: Breakpoint | undefined;
	act(() => {
		created = result.current(breakpointWithoutId);
	});

	expect(created).toEqual({ ...breakpointWithoutId, id: "unique-id" });
	expect(store.getState().breakpoints).toEqual([created]);
});

it("adds a breakpoint silently when options.silent is true", () => {
	const store = createStore({ breakpoints: [] });

	const { result } = renderHook(() => useAddBreakpoint(), {
		wrapper: wrapperFor(store),
	});

	const breakpointWithoutId: Omit<Breakpoint, "id"> = buildBreakpoint({
		from: 200,
	});

	let created: Breakpoint | undefined;
	act(() => {
		created = result.current(breakpointWithoutId, { silent: true });
	});

	expect(store.getState().breakpoints).toEqual([created]);
});
