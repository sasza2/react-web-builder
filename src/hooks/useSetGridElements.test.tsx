import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

import { useSetGridElements } from "./useSetGridElements";

const buildWrapper = (elements: unknown[]) => {
	const store = createStore({
		breakpoints: [{ id: "bp1", cols: 12 } as never],
		selectedBreakpoint: "bp1",
		elementsInBreakpoints: { bp1: elements as never },
	});

	const contextValue = {
		elements,
		elementsCache: { current: new Map() },
		elementsExtras: { current: {} },
	};

	const wrapper = ({ children }: React.PropsWithChildren) => (
		<Provider store={store}>
			<ElementsContext.Provider value={contextValue as never}>
				{children}
			</ElementsContext.Provider>
		</Provider>
	);

	return { store, wrapper };
};

describe("useSetGridElements", () => {
	it("does nothing when nothing changed", () => {
		const elements = [{ id: "el1", x: 0, y: 0, w: 4 }];
		const { store, wrapper } = buildWrapper(elements);

		const { result } = renderHook(() => useSetGridElements(), { wrapper });

		act(() => {
			result.current(
				[{ id: "el1", x: 0, y: 0, w: 4 }] as never,
				{
					type: "user",
				} as never,
			);
		});

		expect(store.getState().elementsInBreakpoints.bp1).toBe(elements);
	});

	it("dispatches via setElements when a new element is added (type user)", () => {
		const elements = [{ id: "el1", x: 0, y: 0, w: 4 }];
		const { store, wrapper } = buildWrapper(elements);

		const { result } = renderHook(() => useSetGridElements(), { wrapper });

		act(() => {
			result.current(
				[
					{ id: "el1", x: 0, y: 0, w: 4 },
					{ id: "el2", x: 1, y: 1, w: 2, render: () => null },
				] as never,
				{ type: "user" } as never,
			);
		});

		const next = store.getState().elementsInBreakpoints.bp1;
		expect(next).toHaveLength(2);
		expect(next[1]).not.toHaveProperty("render");
	});

	it("dispatches via setElementsProgrammatic when position changed (type programmatic)", () => {
		const elements = [{ id: "el1", x: 0, y: 0, w: 4 }];
		const { store, wrapper } = buildWrapper(elements);

		const { result } = renderHook(() => useSetGridElements(), { wrapper });

		act(() => {
			result.current(
				[{ id: "el1", x: 2, y: 0, w: 4 }] as never,
				{
					type: "programmatic",
				} as never,
			);
		});

		expect(store.getState().elementsInBreakpoints.bp1).toEqual([
			{ id: "el1", x: 2, y: 0, w: 4 },
		]);
	});
});
