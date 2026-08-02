import { describe, expect, it } from "vitest";
import { createUniqueId } from "./createUniqueId";

describe("createUniqueId", () => {
	it("returns a string containing a timestamp and a random suffix", () => {
		const id = createUniqueId();
		expect(id).toMatch(/^\d+-[a-z0-9]+$/);
	});

	it("returns unique values across calls", () => {
		const ids = new Set(Array.from({ length: 20 }, () => createUniqueId()));
		expect(ids.size).toBe(20);
	});
});
