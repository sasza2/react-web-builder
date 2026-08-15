import type { PageSettings } from "types";
import { describe, expect, it } from "vitest";

import { getPageSettings } from "./pageSettings";

describe("getPageSettings", () => {
	it("removes breakpoints, elementsInBreakpoints and elementsExtras", () => {
		const page = {
			id: "page-1",
			name: "Home",
			breakpoints: [],
			elementsInBreakpoints: {},
			elementsExtras: {},
		} as unknown as PageSettings;

		expect(getPageSettings(page)).toEqual({
			id: "page-1",
			name: "Home",
		});
	});
});
