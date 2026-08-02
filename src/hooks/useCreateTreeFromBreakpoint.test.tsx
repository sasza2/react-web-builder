import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

const createTreeFromBreakpointMock = vi.fn(() => "result" as never);
vi.mock("@/utils/breakpoint", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/breakpoint")>();
	return {
		...actual,
		createTreeFromBreakpoint: (...args: unknown[]) =>
			createTreeFromBreakpointMock(...args),
	};
});

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: () => ["comp1"],
}));

import { useCreateTreeFromBreakpoint } from "./useCreateTreeFromBreakpoint";

describe("useCreateTreeFromBreakpoint", () => {
	it("builds a tree via utils/breakpoint.createTreeFromBreakpoint with current state", () => {
		const breakpoints = [{ id: "bp1", cols: 12 }] as never;
		const store = createStore({
			breakpoints,
			selectedBreakpoint: "bp1",
			elementsInBreakpoints: { bp1: [{ id: "el1" }] as never },
		});

		const elementsExtras = { current: { bp1: {} } };
		const contextValue = {
			elements: [{ id: "el1" }],
			elementsCache: { current: new Map() },
			elementsExtras,
		};

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>
				<ElementsContext.Provider value={contextValue as never}>
					{children}
				</ElementsContext.Provider>
			</Provider>
		);

		const { result } = renderHook(() => useCreateTreeFromBreakpoint(), {
			wrapper,
		});

		const selectedElements = [{ id: "el1" }] as never;
		const output = result.current(selectedElements, true);

		expect(output).toBe("result");
		expect(createTreeFromBreakpointMock).toHaveBeenCalledWith({
			allBreakpoints: breakpoints,
			components: ["comp1"],
			elementsInBreakpoints: { bp1: [{ id: "el1" }] },
			selectedElements,
			currentBreakpoint: breakpoints[0],
			elementsExtras: elementsExtras.current,
			rewriteContainersIds: true,
		});
	});
});
