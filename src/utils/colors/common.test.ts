import { expect, it } from "vitest";

import { getColorType } from "./common";
import { ColorType } from "./types";

it("returns None for empty color", () => {
	expect(getColorType()).toBe(ColorType.None);
	expect(getColorType("")).toBe(ColorType.None);
});

it("returns Hex for transparent", () => {
	expect(getColorType("transparent")).toBe(ColorType.Hex);
});

it("returns Hex for valid hex color", () => {
	expect(getColorType("#abcdef")).toBe(ColorType.Hex);
});

it("returns Gradient for gradient color", () => {
	expect(
		getColorType("linear-gradient(180deg, #ffaabb00 0%, #ccddee55 100%)"),
	).toBe(ColorType.Gradient);
});

it("returns Gradient for any non-hex string since splitGradientColor always returns an object", () => {
	expect(getColorType("not-a-color")).toBe(ColorType.Gradient);
});
