import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

import { useElements } from "./useElements";

describe("useElements", () => {
	it("returns elements, elementsInBreakpoints and elementsExtras", () => {
		const store = createStore({
			elementsInBreakpoints: { bp1: [{ id: "el1" }] as never },
		});

		const elementsExtras = { current: { bp1: {} } } as never;
		const contextValue = {
			elements: [{ id: "el1" }],
			elementsCache: { current: new Map() },
			elementsExtras,
		} as never;

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>
				<ElementsContext.Provider value={contextValue}>
					{children}
				</ElementsContext.Provider>
			</Provider>
		);

		const { result } = renderHook(() => useElements(), { wrapper });

		expect(result.current.elements).toEqual([{ id: "el1" }]);
		expect(result.current.elementsInBreakpoints).toEqual({
			bp1: [{ id: "el1" }],
		});
		expect(result.current.elementsExtras).toBe(elementsExtras);
	});
});
