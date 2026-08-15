import { renderHook } from "@testing-library/react";
import type { PropsWithChildren } from "react";
import React from "react";
import { Provider } from "react-redux";
import { expect, it } from "vitest";

import { createStore } from "@/store/store";
import { buildBreakpoint } from "@/testing/fixtures";

import { useBreakpoint } from "./useBreakpoint";

const wrapperFor =
	(preloadedState: Parameters<typeof createStore>[0]) =>
	({ children }: PropsWithChildren) => {
		const store = createStore(preloadedState);
		return <Provider store={store}>{children}</Provider>;
	};

it("returns the selected breakpoint when found", () => {
	const breakpoint = buildBreakpoint({ id: "bp-1" });
	const { result } = renderHook(() => useBreakpoint(), {
		wrapper: wrapperFor({
			breakpoints: [breakpoint],
			selectedBreakpoint: "bp-1",
		}),
	});

	expect(result.current).toEqual(breakpoint);
});

it("returns null when no breakpoint matches", () => {
	const { result } = renderHook(() => useBreakpoint(), {
		wrapper: wrapperFor({
			breakpoints: [],
			selectedBreakpoint: "missing",
		}),
	});

	expect(result.current).toBeNull();
});
