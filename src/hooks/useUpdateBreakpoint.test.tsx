import { act, renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useUpdateBreakpoint } from "./useUpdateBreakpoint";

it("updates a breakpoint's properties", () => {
	const breakpoint = buildBreakpoint({ id: "bp-1" });
	const store = createStore({ breakpoints: [breakpoint] });
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useUpdateBreakpoint(), { wrapper });

	act(() => {
		result.current("bp-1", { from: 999 });
	});

	expect(store.getState().breakpoints[0]).toEqual({
		...breakpoint,
		from: 999,
	});
});
