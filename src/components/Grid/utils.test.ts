import { describe, expect, it } from "vitest";

import { buildBreakpoint } from "@/testing/fixtures";

import { getBreakpointKey } from "./utils";

describe("getBreakpointKey", () => {
	it("builds a key from id, from and padding", () => {
		const breakpoint = buildBreakpoint({
			id: "bp-1",
			from: 320,
			padding: { top: 0, right: 10, bottom: 0, left: 5 },
		});

		expect(getBreakpointKey(breakpoint)).toBe("bp-1-320-5-10");
	});
});
