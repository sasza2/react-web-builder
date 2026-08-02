import { renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

const mockUseElements = vi.fn();
const mockCreateTreeElements = vi.fn();
const mockGetBreakpointRowsByLastElement = vi.fn();

vi.mock("../useElements", () => ({
	useElements: () => mockUseElements(),
}));
vi.mock("@/components/View/createTreeElements", () => ({
	default: (...args: never[]) => mockCreateTreeElements(...args),
}));
vi.mock("@/components/View/getBreakpointRowsByLastElement", () => ({
	default: (...args: never[]) => mockGetBreakpointRowsByLastElement(...args),
}));

import { createStore } from "@/store/store";

import { useBuildBreakpointWithTree } from "./useBuildBreakpointWithTree";

const wrapperFor =
	(preloadedState: Parameters<typeof createStore>[0]) =>
	({ children }: React.PropsWithChildren) => {
		const store = createStore(preloadedState);
		return <Provider store={store}>{children}</Provider>;
	};

describe("useBuildBreakpointWithTree", () => {
	it("builds a breakpoint with a view tree using elements from the store", () => {
		const elementsExtras = { current: { "bp-1": { "el-1": { height: 1 } } } };
		mockUseElements.mockReturnValue({ elementsExtras });
		mockGetBreakpointRowsByLastElement.mockReturnValue(5);
		mockCreateTreeElements.mockReturnValue({ type: "tree" });

		const breakpoint = { id: "bp-1", cols: 12 };
		const elementsInBp = [{ id: "el-1" }];

		const { result } = renderHook(() => useBuildBreakpointWithTree(), {
			wrapper: wrapperFor({
				elementsInBreakpoints: { "bp-1": elementsInBp },
			}),
		});

		const built = result.current(breakpoint as never);

		expect(mockGetBreakpointRowsByLastElement).toHaveBeenCalledWith(
			elementsInBp,
			elementsExtras.current["bp-1"],
		);
		expect(mockCreateTreeElements).toHaveBeenCalledWith(
			elementsInBp,
			elementsExtras.current["bp-1"],
			12,
			5,
		);
		expect(built).toEqual({ id: "bp-1", cols: 12, view: { type: "tree" } });
	});

	it("uses empty defaults when breakpoint has no elements or extras", () => {
		mockUseElements.mockReturnValue({ elementsExtras: { current: {} } });
		mockGetBreakpointRowsByLastElement.mockReturnValue(0);
		mockCreateTreeElements.mockReturnValue(null);

		const breakpoint = { id: "bp-2", cols: 6 };

		const { result } = renderHook(() => useBuildBreakpointWithTree(), {
			wrapper: wrapperFor({ elementsInBreakpoints: {} }),
		});

		result.current(breakpoint as never);

		expect(mockGetBreakpointRowsByLastElement).toHaveBeenCalledWith([], {});
		expect(mockCreateTreeElements).toHaveBeenCalledWith([], {}, 6, 0);
	});
});
