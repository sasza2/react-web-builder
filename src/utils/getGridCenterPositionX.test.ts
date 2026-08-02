import { describe, expect, it } from "vitest";

import getGridCenterPositionX from "./getGridCenterPositionX";

describe("getGridCenterPositionX", () => {
	it("returns 0 when panzoom child width is greater than or equal to webBuilder width", () => {
		expect(getGridCenterPositionX(1000, 500, 1)).toBe(0);
		expect(getGridCenterPositionX(500, 500, 1)).toBe(0);
	});

	it("returns centered position when panzoom child width is smaller", () => {
		expect(getGridCenterPositionX(200, 1000, 1)).toBe(400);
	});

	it("accounts for zoom", () => {
		expect(getGridCenterPositionX(200, 1000, 0.5)).toBe(450);
	});
});
