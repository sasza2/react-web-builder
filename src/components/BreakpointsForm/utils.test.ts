import { describe, expect, it } from "vitest";

import type { IForm } from "./types";
import { formToBreakpoint } from "./utils";

describe("formToBreakpoint", () => {
	it("converts a form with stretchToAvailableWidth=true (to becomes null)", () => {
		const form: IForm = {
			from: "500",
			stretchToAvailableWidth: true,
			rowHeight: "20",
			cols: "12",
			backgroundColor: "#fff",
			padding: { top: 1, right: 2, bottom: 3, left: 4 },
		};

		expect(formToBreakpoint(form)).toEqual({
			from: 500,
			to: null,
			rowHeight: 20,
			cols: 12,
			backgroundColor: "#fff",
			padding: { top: 1, right: 2, bottom: 3, left: 4 },
		});
	});

	it("converts a form with stretchToAvailableWidth=false (to equals from)", () => {
		const form: IForm = {
			from: "700",
			stretchToAvailableWidth: false,
			rowHeight: "15",
			cols: "10",
			backgroundColor: "#000",
			padding: { top: 0, right: 0, bottom: 0, left: 0 },
		};

		expect(formToBreakpoint(form)).toEqual({
			from: 700,
			to: 700,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#000",
			padding: { top: 0, right: 0, bottom: 0, left: 0 },
		});
	});
});
