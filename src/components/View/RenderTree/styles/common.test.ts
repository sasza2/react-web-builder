import { expect, it } from "vitest";

import { round } from "./common";

it("formats a number to 3 decimal places", () => {
	expect(round(1)).toBe("1.000");
	expect(round(0.123456)).toBe("0.123");
	expect(round(2 / 3)).toBe("0.667");
});
