import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { useAccordion } from "./useAccordion";

describe("useAccordion", () => {
	it("starts with an empty preExpanded array", () => {
		const { result } = renderHook(() => useAccordion());
		expect(result.current.preExpanded).toEqual([]);
	});

	it("updates preExpanded when onChange is called", () => {
		const { result } = renderHook(() => useAccordion());

		act(() => {
			result.current.onChange(["a", 1]);
		});

		expect(result.current.preExpanded).toEqual(["a", 1]);
	});

	it("keeps a stable accordion object reference across re-renders without state changes", () => {
		const { result, rerender } = renderHook(() => useAccordion());
		const first = result.current;
		rerender();
		expect(result.current).toBe(first);
	});
});
