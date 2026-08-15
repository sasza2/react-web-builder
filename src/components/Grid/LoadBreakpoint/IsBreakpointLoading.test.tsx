import { renderHook } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import {
	IsBreakpointLoading,
	useIsBreakpointLoading,
} from "./IsBreakpointLoading";

describe("IsBreakpointLoading", () => {
	it("defaults to false when no provider is present", () => {
		const { result } = renderHook(() => useIsBreakpointLoading());

		expect(result.current).toBe(false);
	});

	it("returns the value provided by the context provider", () => {
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<IsBreakpointLoading.Provider value>
				{children}
			</IsBreakpointLoading.Provider>
		);

		const { result } = renderHook(() => useIsBreakpointLoading(), { wrapper });

		expect(result.current).toBe(true);
	});
});
