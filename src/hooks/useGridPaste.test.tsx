import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import { createStore } from "@/store/store";

const delayMock = vi.fn(() => Promise.resolve());
vi.mock("@/utils/delay", () => ({
	delay: (...a: unknown[]) => delayMock(...a),
}));

const organizeElements = vi.fn();
vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => ({ current: { organizeElements } }),
}));

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: () => ["comp1"],
}));

const clipboardPasteMock = vi.fn();
vi.mock("@/utils/clipboard", () => ({
	paste: () => clipboardPasteMock(),
}));

const pasteElementMock = vi.fn();
const pasteElementsMock = vi.fn();
vi.mock("@/utils/gridPaste", () => ({
	pasteElement: (...a: unknown[]) => pasteElementMock(...a),
	pasteElements: (...a: unknown[]) => pasteElementsMock(...a),
}));

const createTreeFromBreakpointMock = vi.fn(() => [] as never);
vi.mock("@/utils/breakpoint", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/breakpoint")>();
	return {
		...actual,
		createTreeFromBreakpoint: (...args: unknown[]) =>
			createTreeFromBreakpointMock(...args),
	};
});

import { useGridPaste } from "./useGridPaste";

afterEach(() => {
	vi.clearAllMocks();
	delayMock.mockImplementation(() => Promise.resolve());
});

const buildWrapper = () => {
	const store = createStore({
		breakpoints: [{ id: "bp1", cols: 12 } as never],
		selectedBreakpoint: "bp1",
		elementsInBreakpoints: { bp1: [] as never },
	});

	const contextValue = {
		elements: [],
		elementsCache: { current: new Map() },
		elementsExtras: { current: { bp1: {} } },
	};

	return {
		store,
		wrapper: ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>
				<ElementsContext.Provider value={contextValue as never}>
					{children}
				</ElementsContext.Provider>
			</Provider>
		),
	};
};

describe("useGridPaste", () => {
	it("does nothing when clipboard is empty", () => {
		clipboardPasteMock.mockReturnValue(undefined);
		const { wrapper } = buildWrapper();
		const { result } = renderHook(() => useGridPaste(), { wrapper });

		act(() => {
			result.current(1, 2);
		});

		expect(createTreeFromBreakpointMock).not.toHaveBeenCalled();
	});

	it("pastes a single element and organizes the grid", async () => {
		clipboardPasteMock.mockReturnValue({
			type: "element",
			breakpoint: { cols: 12 },
			element: { id: "el1" },
		});
		pasteElementMock.mockReturnValue({ id: "el1-copy" });

		const { store, wrapper } = buildWrapper();
		const { result } = renderHook(() => useGridPaste(), { wrapper });

		await act(async () => {
			result.current(1, 2);
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(pasteElementMock).toHaveBeenCalledWith({
			breakpoint: { id: "bp1", cols: 12 },
			clipboardBreakpoint: { cols: 12 },
			element: { id: "el1" },
			x: 1,
			y: 2,
		});
		expect(store.getState().elementsInBreakpoints.bp1).toEqual([]);
		expect(organizeElements).toHaveBeenCalled();
	});

	it("pastes a tree with matching cols (addGap 0)", async () => {
		clipboardPasteMock.mockReturnValue({
			type: "tree",
			breakpoint: { cols: 12 },
			elements: [{ id: "el1" }],
			tree: { marginTop: 0, marginBottom: 0 },
		});
		pasteElementsMock.mockReturnValue([{ id: "el1-copy" }]);

		const { wrapper } = buildWrapper();
		const { result } = renderHook(() => useGridPaste(), { wrapper });

		await act(async () => {
			result.current(0, 0);
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(pasteElementsMock).toHaveBeenCalledWith({
			breakpoint: { id: "bp1", cols: 12 },
			clipboardBreakpoint: { cols: 12 },
			elements: [{ id: "el1" }],
			tree: { marginTop: 0, marginBottom: 0 },
			y: 0,
		});
		expect(organizeElements).toHaveBeenCalled();
	});

	it("pastes a tree with different cols (adds margin gap)", async () => {
		clipboardPasteMock.mockReturnValue({
			type: "tree",
			breakpoint: { cols: 6 },
			elements: [{ id: "el1" }],
			tree: { marginTop: 0, marginBottom: 0 },
		});
		pasteElementsMock.mockReturnValue([{ id: "el1-copy" }]);

		const { wrapper } = buildWrapper();
		const { result } = renderHook(() => useGridPaste(), { wrapper });

		await act(async () => {
			result.current(0, 0);
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(organizeElements).toHaveBeenCalled();
	});

	it("throws for an unexpected clipboard type", () => {
		clipboardPasteMock.mockReturnValue({ type: "unknown" });
		const { wrapper } = buildWrapper();
		const { result } = renderHook(() => useGridPaste(), { wrapper });

		expect(() => {
			act(() => {
				result.current(0, 0);
			});
		}).toThrow("grid paste unexpected type unknown");
	});

	it("skips the second organize step when unmounted between the two delays", async () => {
		clipboardPasteMock.mockReturnValue({
			type: "element",
			breakpoint: { cols: 12 },
			element: { id: "el1" },
		});
		pasteElementMock.mockReturnValue({ id: "el1-copy" });

		let resolveSecondDelay: () => void;
		delayMock.mockImplementation((ms: unknown) => {
			if (ms === 2000) {
				return new Promise<void>((resolve) => {
					resolveSecondDelay = resolve;
				});
			}
			return Promise.resolve();
		});

		const { wrapper } = buildWrapper();

		const { result, unmount: unmountHook } = renderHook(() => useGridPaste(), {
			wrapper,
		});

		act(() => {
			result.current(0, 0);
		});
		// let the first delay(100) resolve and organizeElements() run once
		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});
		expect(organizeElements).toHaveBeenCalledTimes(1);

		unmountHook();
		resolveSecondDelay();

		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
		});

		// still only called once: the post-second-delay organize() call was skipped
		expect(organizeElements).toHaveBeenCalledTimes(1);
	});

	it("skips organizing when unmounted before the paste delay resolves", async () => {
		clipboardPasteMock.mockReturnValue({
			type: "element",
			breakpoint: { cols: 12 },
			element: { id: "el1" },
		});
		pasteElementMock.mockReturnValue({ id: "el1-copy" });

		const { wrapper } = buildWrapper();
		const { result, unmount } = renderHook(() => useGridPaste(), { wrapper });

		act(() => {
			result.current(0, 0);
		});
		unmount();

		await act(async () => {
			await Promise.resolve();
			await Promise.resolve();
			await Promise.resolve();
		});

		expect(organizeElements).not.toHaveBeenCalled();
	});
});
