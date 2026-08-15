import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: vi.fn(() => ({
		defaultButtonBackgroundColor: "red",
	})),
}));

vi.mock("./useBreakpoint", () => ({
	useBreakpoint: vi.fn(() => ({ id: "bp1", cols: 12 })),
}));

import { useWebBuilderProperties } from "@/components/PropertiesProvider";

import { useElementsCache } from "./useElementsCache";

const buildWrapper = (contextValue: unknown) => {
	const store = createStore({
		elementsInBreakpoints: { bp1: [{ id: "el1" }, { id: "el2" }] as never },
	});

	return ({ children }: React.PropsWithChildren) => (
		<Provider store={store}>
			<ElementsContext.Provider value={contextValue as never}>
				{children}
			</ElementsContext.Provider>
		</Provider>
	);
};

describe("useElementsCache", () => {
	it("provides get/set/remove operating on a breakpoint-scoped cache", () => {
		const elementsCache = { current: new Map() };
		const wrapper = buildWrapper({
			elementsCache,
			elements: [{ id: "el1" }, { id: "el2" }],
			elementsExtras: { current: {} },
		});

		const { result } = renderHook(() => useElementsCache(), { wrapper });

		const renderFunc = () => null;
		act(() => {
			result.current.set("el1", renderFunc as never);
		});
		expect(elementsCache.current.get("bp1-el1")).toBe(renderFunc);
		expect(result.current.get("el1")).toBe(renderFunc);

		act(() => {
			result.current.remove("el1");
		});
		expect(elementsCache.current.get("bp1-el1")).toBeUndefined();
	});

	it("clears cache when defaultButtonBackgroundColor changes", () => {
		const elementsCache = { current: new Map([["bp1-el1", () => null]]) };
		const wrapper = buildWrapper({
			elementsCache,
			elements: [{ id: "el1" }],
			elementsExtras: { current: {} },
		});

		vi.mocked(useWebBuilderProperties).mockReturnValue({
			defaultButtonBackgroundColor: "blue",
		} as never);

		const { rerender } = renderHook(() => useElementsCache(), { wrapper });

		vi.mocked(useWebBuilderProperties).mockReturnValue({
			defaultButtonBackgroundColor: "green",
		} as never);
		rerender();

		expect(elementsCache.current.size).toBe(0);
	});

	it("keeps only cache entries for elements that still exist after elements change", () => {
		vi.mocked(useWebBuilderProperties).mockReturnValue({
			defaultButtonBackgroundColor: "stable",
		} as never);

		const elementsCache = { current: new Map() };
		const store = createStore({
			elementsInBreakpoints: { bp1: [{ id: "el1" }, { id: "el2" }] as never },
		});
		const contextValue = {
			elementsCache,
			elements: [{ id: "el1" }, { id: "el2" }],
			elementsExtras: { current: {} },
		};

		const Wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>
				<ElementsContext.Provider value={contextValue as never}>
					{children}
				</ElementsContext.Provider>
			</Provider>
		);

		const { result, rerender } = renderHook(() => useElementsCache(), {
			wrapper: Wrapper,
		});

		act(() => {
			result.current.set("el1", (() => null) as never);
			result.current.set("el2", (() => null) as never);
		});
		expect(elementsCache.current.has("bp1-el1")).toBe(true);
		expect(elementsCache.current.has("bp1-el2")).toBe(true);

		contextValue.elements = [{ id: "el1" }];
		rerender();

		expect(elementsCache.current.has("bp1-el1")).toBe(true);
		expect(elementsCache.current.has("bp1-el2")).toBe(false);
	});

	// Note: `useElementsCache` (line 22, `breakpointId.current = breakpoint.id`)
	// dereferences `breakpoint` without a null-check even though `useBreakpoint()`
	// is typed as `Breakpoint | null`, while the effect below it (line 32) does
	// guard with `if (!breakpoint) return;`. In practice this means a null
	// breakpoint crashes the hook before that guard is ever reached, so the
	// effect's early-return branch is unreachable as currently written. Verified
	// experimentally: rendering with `useBreakpoint` mocked to return `null`
	// throws `Cannot read properties of null (reading 'id')` at line 22. Not
	// fixed here (out of scope: source-code changes), reported as a bug instead.
});
