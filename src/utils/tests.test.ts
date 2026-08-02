import { describe, expect, it } from "vitest";

import { assignTestProp } from "./tests";

describe("assignTestProp", () => {
	it("returns empty object when testId is missing", () => {
		expect(assignTestProp()).toEqual({});
	});

	it("returns data-testid with just testId", () => {
		expect(assignTestProp("button")).toEqual({ "data-testid": "button" });
	});

	it("returns data-testid with block", () => {
		expect(assignTestProp("button", "icon")).toEqual({
			"data-testid": "button__icon",
		});
	});

	it("returns data-testid with modifiers", () => {
		expect(assignTestProp("button", "icon", "active", "disabled")).toEqual({
			"data-testid": "button__icon button__icon--active button__icon--disabled",
		});
	});

	it("filters out falsy modifiers", () => {
		expect(assignTestProp("button", null, "active", "")).toEqual({
			"data-testid": "button button--active",
		});
	});

	it("works without block but with modifiers", () => {
		expect(assignTestProp("button", undefined, "active")).toEqual({
			"data-testid": "button button--active",
		});
	});
});
