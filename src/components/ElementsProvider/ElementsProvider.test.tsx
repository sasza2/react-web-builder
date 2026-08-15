import { render, renderHook, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

const mockUseWebBuilderProperties = vi.fn();
vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

const mockUseBreakpoint = vi.fn();
vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

import { createStore } from "@/store/store";

import { ElementsContext, ElementsProvider } from "./ElementsProvider";

const buildWrapper = (store: ReturnType<typeof createStore>) =>
	function Wrapper({ children }: React.PropsWithChildren) {
		return (
			<Provider store={store}>
				<ElementsProvider>{children}</ElementsProvider>
			</Provider>
		);
	};

describe("ElementsProvider", () => {
	it("renders children", () => {
		mockUseWebBuilderProperties.mockReturnValue({ page: undefined });
		mockUseBreakpoint.mockReturnValue(null);
		const store = createStore({});

		render(
			<Provider store={store}>
				<ElementsProvider>
					<div>child</div>
				</ElementsProvider>
			</Provider>,
		);

		expect(screen.getByText("child")).not.toBeNull();
	});

	it("provides EMPTY_ELEMENTS when there is no matching breakpoint", () => {
		mockUseWebBuilderProperties.mockReturnValue({ page: undefined });
		mockUseBreakpoint.mockReturnValue(null);
		const store = createStore({});

		const { result } = renderHook(() => React.useContext(ElementsContext), {
			wrapper: buildWrapper(store),
		});

		expect(result.current.elements).toEqual([]);
		expect(result.current.elementsCache.current).toBeInstanceOf(Map);
		expect(result.current.elementsExtras.current).toEqual({});
	});

	it("provides elements for the selected breakpoint and initializes elementsExtras from the page", () => {
		mockUseWebBuilderProperties.mockReturnValue({
			page: { elementsExtras: { bp1: { foo: "bar" } } },
		});
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });
		const store = createStore({
			elementsInBreakpoints: { bp1: [{ id: "el1" }] },
		} as never);

		const { result } = renderHook(() => React.useContext(ElementsContext), {
			wrapper: buildWrapper(store),
		});

		expect(result.current.elements).toEqual([{ id: "el1" }]);
		expect(result.current.elementsExtras.current).toEqual({
			bp1: { foo: "bar" },
		});
	});

	it("does not overwrite already-initialized elementsExtras for a breakpoint", () => {
		mockUseWebBuilderProperties.mockReturnValue({
			page: { elementsExtras: { bp1: { foo: "should-not-apply" } } },
		});
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });
		const store = createStore({});

		const { result, rerender } = renderHook(
			() => React.useContext(ElementsContext),
			{ wrapper: buildWrapper(store) },
		);

		result.current.elementsExtras.current.bp1 = { foo: "already-set" };
		rerender();

		expect(result.current.elementsExtras.current.bp1).toEqual({
			foo: "already-set",
		});
	});
});
