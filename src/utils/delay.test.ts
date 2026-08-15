import { describe, expect, it, vi } from "vitest";
import { delay } from "./delay";

describe("delay", () => {
	it("resolves after the given timeout", async () => {
		vi.useFakeTimers();
		const promise = delay(1000);
		vi.advanceTimersByTime(1000);
		await expect(promise).resolves.toBeUndefined();
		vi.useRealTimers();
	});
});
