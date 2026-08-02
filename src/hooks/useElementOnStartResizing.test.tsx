import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { createStore } from "@/store/store";

import { useElementOnStartResizing } from "./useElementOnStartResizing";

describe("useElementOnStartResizing", () => {
	it("clears selected elements when resizing starts", () => {
		const store = createStore({ selectedElements: ["el1", "el2"] });
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useElementOnStartResizing(), {
			wrapper,
		});

		act(() => {
			result.current();
		});

		expect(store.getState().selectedElements).toEqual([]);
	});

	it("returns a stable callback across re-renders", () => {
		const store = createStore({ selectedElements: [] });
		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result, rerender } = renderHook(() => useElementOnStartResizing(), {
			wrapper,
		});
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});
});
