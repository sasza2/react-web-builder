import { expect, it } from "vitest";

import {
	GradientType,
	gradientToValue,
	isValidGradientColor,
	splitGradientColor,
} from "./gradient";

it("gradient", () => {
	const background =
		"radial-gradient(circle, #ffaabb00 0%, #ccddee55 35%, #abcdefff 100%)";
	const gradient = splitGradientColor(background);

	expect(gradient).toStrictEqual({
		type: "radial-gradient",
		angle: "circle",
		colors: [
			{ color: "#ffaabb00", percent: 0 },
			{ color: "#ccddee55", percent: 35 },
			{ color: "#abcdefff", percent: 100 },
		],
	});

	expect(gradientToValue(gradient)).toBe(background);
});

it("splitGradientColor returns default transparent gradient for empty input", () => {
	expect(splitGradientColor("")).toStrictEqual({
		angle: 180,
		type: GradientType.Linear,
		colors: [
			{ color: "transparent", percent: 20 },
			{ color: "transparent", percent: 80 },
		],
	});
});

it("splitGradientColor wraps a plain color into a gradient", () => {
	const gradient = splitGradientColor("#5d0350ff");

	expect(gradient.type).toBe(GradientType.Linear);
	expect(gradient.angle).toBe(180);
	expect(gradient.colors[0]).toStrictEqual({
		color: "#5d0350ff",
		percent: 20,
	});
	expect(gradient.colors[1].percent).toBe(80);
});

it("isValidGradientColor is always truthy since splitGradientColor never returns null", () => {
	expect(isValidGradientColor("anything")).toBe(true);
});

it("gradientToValue defaults invalid angle to 180", () => {
	const value = gradientToValue({
		type: GradientType.Linear,
		angle: NaN,
		colors: [{ color: "#abcdef", percent: 50 }],
	});

	expect(value).toBe("linear-gradient(180deg, #abcdef 50%)");
});

it("gradientToValue renders radial gradient as circle", () => {
	const value = gradientToValue({
		type: GradientType.Radial,
		angle: "circle",
		colors: [{ color: "#abcdef", percent: 100 }],
	});

	expect(value).toBe("radial-gradient(circle, #abcdef 100%)");
});
