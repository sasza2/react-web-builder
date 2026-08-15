import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

vi.mock("@/components/View/createTreeElements", () => ({
	default: vi.fn(() => "tree"),
}));
vi.mock("@/components/View/getBreakpointRowsByLastElement", () => ({
	default: vi.fn(() => 3),
}));

const copyMock = vi.fn();
vi.mock("@/utils/clipboard", () => ({
	copy: (...a: unknown[]) => copyMock(...a),
}));

import { useCopyElements } from "./useCopyElements";

const el1 = { id: "el1" };
const el2 = { id: "el2" };
const el3 = { id: "el3" };

const buildWrapper = (selectedElements: Array<string | number>) => {
	const store = createStore({
		breakpoints: [{ id: "bp1", cols: 12 } as never],
		selectedBreakpoint: "bp1",
		selectedElements,
		elementsInBreakpoints: { bp1: [el1, el2, el3] as never },
	});

	const contextValue = {
		elements: [el1, el2, el3],
		elementsCache: { current: new Map() },
		elementsExtras: { current: { bp1: {} } },
	};

	return ({ children }: React.PropsWithChildren) => (
		<Provider store={store}>
			<ElementsContext.Provider value={contextValue as never}>
				{children}
			</ElementsContext.Provider>
		</Provider>
	);
};

afterEach(() => {
	vi.clearAllMocks();
});

describe("useCopyElements", () => {
	it("copyElement copies a single non-selected element", () => {
		const wrapper = buildWrapper([]);
		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyElement("el1");

		expect(copyMock).toHaveBeenCalledWith({
			breakpoint: { cols: 12 },
			element: el1,
			type: "element",
		});
	});

	it("copyElement does nothing when element is not found", () => {
		const wrapper = buildWrapper([]);
		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyElement("missing");

		expect(copyMock).not.toHaveBeenCalled();
	});

	it("copyElement copies all selected elements as a tree when element is selected", () => {
		const wrapper = buildWrapper(["el1", "el2"]);
		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyElement("el1");

		expect(copyMock).toHaveBeenCalledWith({
			breakpoint: { cols: 12 },
			elements: [el1, el2],
			tree: "tree",
			type: "tree",
		});
	});

	it("copyAllElements copies every element in the current breakpoint as a tree", () => {
		const wrapper = buildWrapper([]);
		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyAllElements();

		expect(copyMock).toHaveBeenCalledWith({
			breakpoint: { cols: 12 },
			elements: [el1, el2, el3],
			tree: "tree",
			type: "tree",
		});
	});

	it("copyAllElements copies an empty list when the breakpoint has no elements entry", () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			selectedElements: [],
			elementsInBreakpoints: {},
		});
		const contextValue = {
			elements: [],
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

		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyAllElements();

		expect(copyMock).toHaveBeenCalledWith({
			breakpoint: { cols: 12 },
			elements: [],
			tree: "tree",
			type: "tree",
		});
	});

	it("falls back to {} for elementsExtras when the breakpoint has no extras entry", () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			selectedElements: [],
			elementsInBreakpoints: { bp1: [el1] as never },
		});
		const contextValue = {
			elements: [el1],
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

		const { result } = renderHook(() => useCopyElements(), { wrapper });

		result.current.copyAllElements();

		expect(copyMock).toHaveBeenCalledWith({
			breakpoint: { cols: 12 },
			elements: [el1],
			tree: "tree",
			type: "tree",
		});
	});
});
