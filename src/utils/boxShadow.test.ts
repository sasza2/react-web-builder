import { describe, expect, it } from "vitest";

import { boxShadowToValue, splitBoxShadow } from "./boxShadow";

describe("splitBoxShadow", () => {
	it("returns default when value is falsy", () => {
		expect(splitBoxShadow("")).toEqual({
			inset: false,
			horizontalLength: 0,
			verticalLength: 4,
			blurRadius: 4,
			spreadRadius: 0,
			color: "#5E5E5E",
		});
	});

	it("parses value without inset", () => {
		expect(splitBoxShadow("1px 2px 3px 4px #fff")).toEqual({
			inset: false,
			horizontalLength: 1,
			verticalLength: 2,
			blurRadius: 3,
			spreadRadius: 4,
			color: "#fff",
		});
	});

	it("parses value with inset", () => {
		expect(splitBoxShadow("inset 1px 2px 3px 4px #fff")).toEqual({
			inset: true,
			horizontalLength: 1,
			verticalLength: 2,
			blurRadius: 3,
			spreadRadius: 4,
			color: "#fff",
		});
	});
});

describe("boxShadowToValue", () => {
	it("returns value string without inset", () => {
		expect(
			boxShadowToValue({
				inset: false,
				horizontalLength: 1,
				verticalLength: 2,
				blurRadius: 3,
				spreadRadius: 4,
				color: "#fff",
			}),
		).toBe("1px 2px 3px 4px #fff");
	});

	it("returns value string with inset", () => {
		expect(
			boxShadowToValue({
				inset: true,
				horizontalLength: 1,
				verticalLength: 2,
				blurRadius: 3,
				spreadRadius: 4,
				color: "#fff",
			}),
		).toBe("inset 1px 2px 3px 4px #fff");
	});
});
