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

import useRemoveElementsByBreakpoint from "./useRemoveElementsByBreakpoint";

describe("useRemoveElementsByBreakpoint", () => {
	it("removes the breakpoint entirely and resets the pan/zoom boundary", async () => {
		const store = createStore({
			breakpoints: [{ id: "bp1", cols: 12 } as never],
			selectedBreakpoint: "bp1",
			elementsInBreakpoints: { bp1: [{ id: "el1" }] as never },
		});

		const wrapper = ({ children }: React.PropsWithChildren) => (
			<Provider store={store}>{children}</Provider>
		);

		const { result } = renderHook(() => useRemoveElementsByBreakpoint(), {
			wrapper,
		});

		await act(async () => {
			await result.current({ id: "bp1", cols: 12 } as never);
		});

		expect(store.getState().elementsInBreakpoints.bp1).toBeUndefined();
		expect(goBackToBoundary).toHaveBeenCalledTimes(1);
	});
});
