import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useAddElement } from "./useAddElement";

describe("useAddElement", () => {
	it("dispatches addElementToBreakpoint for the current breakpoint", () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			elementsInBreakpoints: {},
		});

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useAddElement(), { wrapper });

		act(() => {
			result.current({ id: "el1" } as never);
		});

		expect(store.getState().elementsInBreakpoints.bp1).toEqual([{ id: "el1" }]);
	});
});
