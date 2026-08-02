import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("copy-to-clipboard", () => ({ default: vi.fn() }));

import copyToClipboard from "copy-to-clipboard";
import { copy, hasClipboard, paste } from "./clipboard";

describe("clipboard", () => {
	afterEach(() => {
		vi.clearAllMocks();
	});

	it("returns undefined and false when nothing was copied yet", () => {
		expect(hasClipboard()).toBe(false);
		expect(paste()).toBeUndefined();
	});

	it("copies a value, calling the underlying copyToClipboard with a JSON string", () => {
		copy({ a: 1 });
		expect(copyToClipboard).toHaveBeenCalledWith(JSON.stringify({ a: 1 }));
		expect(hasClipboard()).toBe(true);
	});

	it("pastes back the parsed value that was copied", () => {
		copy({ a: 1 });
		expect(paste()).toEqual({ a: 1 });
	});
});
