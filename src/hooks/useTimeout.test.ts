import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect, it, vi } from "vitest";

import { useTimeout } from "./useTimeout";

beforeEach(() => {
	vi.useFakeTimers();
});

afterEach(() => {
	vi.useRealTimers();
});

it("calls the callback after the timeout while mounted", () => {
	const { result } = renderHook(() => useTimeout());
	const cb = vi.fn();

	act(() => {
		result.current(cb, 1000);
	});

	act(() => {
		vi.advanceTimersByTime(1000);
	});

	expect(cb).toHaveBeenCalledTimes(1);
});

it("does not call the callback if unmounted before the timeout fires", () => {
	const { result, unmount } = renderHook(() => useTimeout());
	const cb = vi.fn();

	act(() => {
		result.current(cb, 1000);
	});

	unmount();

	act(() => {
		vi.advanceTimersByTime(1000);
	});

	expect(cb).not.toHaveBeenCalled();
});

it("clears the previous timer when called again", () => {
	const { result } = renderHook(() => useTimeout());
	const cb = vi.fn();

	act(() => {
		result.current(cb, 1000);
		result.current(cb, 1000);
	});

	act(() => {
		vi.advanceTimersByTime(1000);
	});

	expect(cb).toHaveBeenCalledTimes(1);
});
