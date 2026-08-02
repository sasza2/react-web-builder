import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { DOUBLE_CLICK_TIMEOUT } from "@/consts";

import { useIsDoubleClickOnElement } from "./useIsDoubleClickOnElement";

describe("useIsDoubleClickOnElement", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("returns false for the first click on an element", () => {
		const { result } = renderHook(() => useIsDoubleClickOnElement());
		expect(result.current("el-1")).toBe(false);
	});

	it("returns true when clicking the same element within the timeout", () => {
		const { result } = renderHook(() => useIsDoubleClickOnElement());
		expect(result.current("el-1")).toBe(false);
		vi.advanceTimersByTime(10);
		expect(result.current("el-1")).toBe(true);
	});

	it("returns false when clicking the same element after the timeout elapsed", () => {
		const { result } = renderHook(() => useIsDoubleClickOnElement());
		expect(result.current("el-1")).toBe(false);
		vi.advanceTimersByTime(DOUBLE_CLICK_TIMEOUT + 100);
		expect(result.current("el-1")).toBe(false);
	});

	it("resets tracking when a different element is clicked", () => {
		const { result } = renderHook(() => useIsDoubleClickOnElement());
		expect(result.current("el-1")).toBe(false);
		expect(result.current("el-2")).toBe(false);
	});
});
