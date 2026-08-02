import { renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSize: vi.fn(() => ({ width: 100, height: 200 })),
}));

import { useWebBuilderSize } from "@/components/WebBuilderSize";

import { useGridPositionTop } from "./useGridPositionTop";

describe("useGridPositionTop", () => {
	it("computes top based on window height, webBuilderSize height and navbar height", () => {
		vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);

		const { result } = renderHook(() => useGridPositionTop());

		// NAVBAR_HEIGHT = 80
		expect(result.current).toBe(1000 - 200 + 80);
	});

	it("recomputes when webBuilderSize.height changes", () => {
		vi.spyOn(window, "innerHeight", "get").mockReturnValue(1000);
		vi.mocked(useWebBuilderSize).mockReturnValue({
			width: 100,
			height: 300,
		} as never);

		const { result } = renderHook(() => useGridPositionTop());

		expect(result.current).toBe(1000 - 300 + 80);
	});
});
