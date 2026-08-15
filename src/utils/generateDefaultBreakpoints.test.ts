import { describe, expect, it } from "vitest";

import generateDefaultBreakpoints from "./generateDefaultBreakpoints";

describe("generateDefaultBreakpoints", () => {
	it("returns two breakpoints with unique ids", () => {
		const breakpoints = generateDefaultBreakpoints();

		expect(breakpoints).toHaveLength(2);
		expect(breakpoints[0].from).toBe(360);
		expect(breakpoints[1].from).toBe(1280);
		expect(breakpoints[0].id).not.toBe(breakpoints[1].id);
	});
});
