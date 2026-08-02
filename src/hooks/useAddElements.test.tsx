import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useAddElements } from "./useAddElements";

describe("useAddElements", () => {
	it("dispatches addElementsToBreakpoint for the current breakpoint", () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			elementsInBreakpoints: { bp1: [{ id: "existing" }] as never },
		});

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useAddElements(), { wrapper });

		act(() => {
			result.current([{ id: "el1" }, { id: "el2" }] as never);
		});

		expect(store.getState().elementsInBreakpoints.bp1).toEqual([
			{ id: "existing" },
			{ id: "el1" },
			{ id: "el2" },
		]);
	});
});
