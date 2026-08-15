import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useBreakpoints } from "./useBreakpoints";

it("returns breakpoints from state", () => {
	const breakpoints = [buildBreakpoint({ id: "bp-1" })];
	const store = createStore({ breakpoints });
	const wrapper = ({ children }: PropsWithChildren) => (
		<Provider store={store}>{children}</Provider>
	);

	const { result } = renderHook(() => useBreakpoints(), { wrapper });

	expect(result.current).toEqual(breakpoints);
});
