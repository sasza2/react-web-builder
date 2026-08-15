import { renderHook } from "@testing-library/react";
import type { Page } from "types";
import { describe, expect, it } from "vitest";

import { useValidatePage } from "./useValidatePage";

describe("useValidatePage", () => {
	it("returns false when page is null/undefined", () => {
		const { result } = renderHook(() => useValidatePage());
		expect(result.current(null as unknown as Page)).toBe(false);
		expect(result.current(undefined as unknown as Page)).toBe(false);
	});

	it("returns false when page is not an object", () => {
		const { result } = renderHook(() => useValidatePage());
		expect(result.current("string" as unknown as Page)).toBe(false);
	});

	it("returns false when breakpoints is not an array", () => {
		const { result } = renderHook(() => useValidatePage());
		expect(result.current({ breakpoints: null } as unknown as Page)).toBe(
			false,
		);
	});

	it("returns true when page is valid", () => {
		const { result } = renderHook(() => useValidatePage());
		expect(result.current({ breakpoints: [] } as unknown as Page)).toBe(true);
	});
});
