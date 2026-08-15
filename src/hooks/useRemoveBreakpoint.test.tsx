import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useRemoveBreakpoint } from "./useRemoveBreakpoint";

it("removes a breakpoint from the store", () => {
	const breakpoint = buildBreakpoint({ id: "bp-1" });
	const store = createStore({ breakpoints: [breakpoint] });
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useRemoveBreakpoint(), { wrapper });

	act(() => {
		result.current(breakpoint);
	});

	expect(store.getState().breakpoints).toEqual([]);
});
