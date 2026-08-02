import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useBreakpointWaitForLoad } from "./useBreakpointWaitForLoad";

describe("useBreakpointWaitForLoad", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("resolves the promise automatically after the default continue-waiting time", async () => {
		const { result } = renderHook(() => useBreakpointWaitForLoad());
		const [promiseRef] = result.current;

		let resolved = false;
		promiseRef.current.then(() => {
			resolved = true;
		});

		await vi.advanceTimersByTimeAsync(4000);

		expect(resolved).toBe(true);
	});

	it("keeps the same promise ref across re-renders", () => {
		const { result, rerender } = renderHook(() => useBreakpointWaitForLoad());
		const [firstPromiseRef] = result.current;

		rerender();

		const [secondPromiseRef] = result.current;

		expect(firstPromiseRef).toBe(secondPromiseRef);
	});

	it("continueWaiting resets the timer so the promise resolves after the continue-waiting window", async () => {
		const { result } = renderHook(() => useBreakpointWaitForLoad());
		const [promiseRef, continueWaiting] = result.current;

		let resolved = false;
		promiseRef.current.then(() => {
			resolved = true;
		});

		await vi.advanceTimersByTimeAsync(2000);
		continueWaiting();
		await vi.advanceTimersByTimeAsync(2000);

		expect(resolved).toBe(false);

		await vi.advanceTimersByTimeAsync(2000);

		expect(resolved).toBe(true);
	});

	it("resolves after the max waiting time even without continueWaiting calls", async () => {
		const { result, unmount } = renderHook(() => useBreakpointWaitForLoad());
		const [promiseRef, continueWaiting] = result.current;

		let resolved = false;
		promiseRef.current.then(() => {
			resolved = true;
		});

		// Repeatedly push the continue-waiting timer so it never fires on its own,
		// to exercise the max-waiting-time effect timer instead.
		for (let i = 0; i < 11; i += 1) {
			continueWaiting();
			await vi.advanceTimersByTimeAsync(3000);
		}

		expect(resolved).toBe(true);

		unmount();
	});

	it("clears the max-waiting timer on unmount", () => {
		const clearSpy = vi.spyOn(global, "clearTimeout");
		const { unmount } = renderHook(() => useBreakpointWaitForLoad());

		unmount();

		expect(clearSpy).toHaveBeenCalled();
		clearSpy.mockRestore();
	});
});
