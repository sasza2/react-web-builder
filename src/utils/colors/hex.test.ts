import { expect, it } from "vitest";

import {
	getColorForInput,
	getColorForSketch,
	getColorForTooltip,
	isColorTransparent,
	isLightColor,
	isValidColor,
	normalizeColor,
	normalizeSketchColor,
	shadeColor,
} from "./hex";

it("shade color", () => {
	expect(shadeColor("#5d0350", 40)).toBe("#820470ff");
});

it("normalizes 6-digit color by adding alpha", () => {
	expect(normalizeColor("#abcdef")).toBe("#abcdefff");
});

it("normalizes color without hash", () => {
	expect(normalizeColor("abcdef")).toBe("#abcdefff");
});

it("normalizes 8-digit color as-is", () => {
	expect(normalizeColor("#abcdef12")).toBe("#abcdef12");
});

it("normalizeColor handles empty string", () => {
	expect(normalizeColor("")).toBe("#");
});

it("validates a correct color", () => {
	expect(isValidColor("#abcdef")).toBe(true);
	expect(isValidColor("#abcdef12")).toBe(true);
});

it("invalidates an incorrect color", () => {
	expect(isValidColor("")).toBe(false);
	expect(isValidColor("not-a-color")).toBe(false);
});

it("detects transparent color", () => {
	expect(isColorTransparent("#ffffff00")).toBe(true);
	expect(isColorTransparent("#ffffffff")).toBe(false);
});

it("isColorTransparent returns false for invalid color", () => {
	expect(isColorTransparent("not-a-color")).toBe(false);
});

it("detects light color", () => {
	expect(isLightColor("#ffffffff")).toBe(true);
	expect(isLightColor("#000000ff")).toBe(false);
});

it("isLightColor returns null for invalid color", () => {
	expect(isLightColor("not-a-color")).toBe(null);
});

it("getColorForSketch handles gradient", () => {
	expect(
		getColorForSketch("linear-gradient(180deg, #ffaabb00 20%, #ccddee55 80%)"),
	).toBe("#ffaabb00");
});

it("getColorForSketch handles transparent", () => {
	expect(getColorForSketch("transparent")).toBe("#ffffff00");
});

it("getColorForSketch handles plain color", () => {
	expect(getColorForSketch("#abcdef")).toBe("#abcdefff");
});

it("getColorForSketch falls back to defaultValue", () => {
	expect(getColorForSketch(undefined, "transparent")).toBe("#ffffff00");
	expect(getColorForSketch(undefined, "#abcdef")).toBe("#abcdefff");
	expect(getColorForSketch()).toBe("#ffffff00");
});

it("getColorForInput strips trailing ff alpha", () => {
	expect(getColorForInput("#abcdef")).toBe("abcdef");
});

it("getColorForInput keeps non-ff alpha", () => {
	expect(getColorForInput("#abcdef12")).toBe("abcdef12");
});

it("getColorForTooltip handles transparent", () => {
	expect(getColorForTooltip("transparent")).toBe("transparent");
});

it("getColorForTooltip handles color", () => {
	expect(getColorForTooltip("#abcdef")).toBe("#abcdef");
});

it("normalizeSketchColor handles transparent", () => {
	expect(
		normalizeSketchColor({
			hex: "transparent",
			rgb: { r: 0, g: 0, b: 0, a: 1 },
		} as never),
	).toBe("transparent");
});

it("normalizeSketchColor computes alpha from rgb", () => {
	expect(
		normalizeSketchColor({
			hex: "#abcdef",
			rgb: { r: 171, g: 205, b: 239, a: 0.5 },
		} as never),
	).toBe("#abcdef7f");
});

it("normalizeSketchColor defaults alpha to 1 when missing", () => {
	expect(
		normalizeSketchColor({
			hex: "#abcdef",
			rgb: { r: 171, g: 205, b: 239 },
		} as never),
	).toBe("#abcdefff");
});
