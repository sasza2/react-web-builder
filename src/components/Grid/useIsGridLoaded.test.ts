import { act, renderHook } from "@testing-library/react";
import type React from "react";
import type { GridAPI } from "react-grid-panzoom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: vi.fn(),
}));

import { useGridAPI } from "@/components/GridAPIProvider";

import { buildGridAPI } from "@/testing/fixtures";

import useIsGridLoaded from "./useIsGridLoaded";

describe("useIsGridLoaded", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.mocked(useGridAPI).mockReset();
	});

	it("stays false while gridAPIRef.current is not set", () => {
		vi.mocked(useGridAPI).mockReturnValue({ current: null });
		const { result } = renderHook(() => useIsGridLoaded());

		expect(result.current).toBe(false);
		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(result.current).toBe(false);
	});

	it("becomes true once gridAPIRef.current is set", () => {
		const gridAPIRef: React.MutableRefObject<GridAPI> = { current: null };
		vi.mocked(useGridAPI).mockReturnValue(gridAPIRef);
		const { result } = renderHook(() => useIsGridLoaded());

		expect(result.current).toBe(false);

		gridAPIRef.current = buildGridAPI();
		act(() => {
			vi.advanceTimersByTime(200);
		});

		expect(result.current).toBe(true);
	});

	it("stops polling and clears interval on unmount", () => {
		vi.mocked(useGridAPI).mockReturnValue({ current: null });
		const clearIntervalSpy = vi.spyOn(global, "clearInterval");
		const { unmount } = renderHook(() => useIsGridLoaded());
		unmount();
		expect(clearIntervalSpy).toHaveBeenCalled();
		clearIntervalSpy.mockRestore();
	});

	it("does not re-poll once isLoaded is already true (effect early return)", () => {
		const gridAPIRef: React.MutableRefObject<GridAPI> = {
			current: buildGridAPI(),
		};
		vi.mocked(useGridAPI).mockReturnValue(gridAPIRef);
		const { result, rerender } = renderHook(() => useIsGridLoaded());

		act(() => {
			vi.advanceTimersByTime(200);
		});
		expect(result.current).toBe(true);

		rerender();
		expect(result.current).toBe(true);
	});
});
