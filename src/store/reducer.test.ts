import { describe, expect, it } from "vitest";

import reducer from "./reducer";

describe("reducer", () => {
	it("exposes all slice reducers", () => {
		expect(Object.keys(reducer).sort()).toEqual(
			[
				"breakpoints",
				"changes",
				"elementsInBreakpoints",
				"pageSettings",
				"selectedBreakpoint",
				"selectedElement",
				"selectedElements",
				"sidebar",
			].sort(),
		);
	});
});
