import { act, renderHook } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { createStore } from "@/store/store";

vi.mock("@/utils/delay", () => ({ delay: () => Promise.resolve() }));

const goBackToBoundary = vi.fn();
vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => ({
		current: { getPanZoom: () => ({ goBackToBoundary }) },
	}),
}));

const createTreeFromBreakpointMock = vi.fn(() => [] as never);
vi.mock("./useCreateTreeFromBreakpoint", () => ({
	useCreateTreeFromBreakpoint: () => createTreeFromBreakpointMock,
}));

import useRemoveSelectedElements from "./useRemoveSelectedElements";

describe("useRemoveSelectedElements", () => {
	it("removes only the selected elements and resets the pan/zoom boundary", async () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			selectedElements: ["el1"],
			elementsInBreakpoints: {
				bp1: [{ id: "el1" }, { id: "el2" }] as never,
			},
		});

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useRemoveSelectedElements(), {
			wrapper,
		});

		await act(async () => {
			await result.current();
		});

		expect(createTreeFromBreakpointMock).toHaveBeenCalledWith(
			[{ id: "el1" }],
			false,
		);
		expect(goBackToBoundary).toHaveBeenCalledTimes(1);
	});
});
