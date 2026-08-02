import { expect, it } from "vitest";

import {
	alignItemsValidator,
	allowedCSSProperties,
	borderValidator,
	flexValidator,
	fontFamilyValidator,
	spacingValidator,
} from "./validators";

it("valid flex values", () => {
	expect(flexValidator("1")).toBeTruthy();
	expect(flexValidator("1 0")).toBeTruthy();
	expect(flexValidator("1 0 auto")).toBeTruthy();
	expect(flexValidator("0 1 100px")).toBeTruthy();
	expect(flexValidator("2 2 10%")).toBeTruthy();
	expect(flexValidator("0 0 auto")).toBeTruthy();
	expect(flexValidator("initial")).toBeTruthy();
	expect(flexValidator("inherit")).toBeTruthy();
	expect(flexValidator("unset")).toBeTruthy();
	expect(flexValidator("none")).toBeTruthy();
	expect(flexValidator("auto")).toBeTruthy();
});

it("invalid flex values", () => {
	expect(flexValidator("abc")).toBeFalsy();
	expect(flexValidator("1 0 auto something")).toBeFalsy();
	expect(flexValidator("1px 0 auto")).toBeFalsy();
	expect(flexValidator("auto auto")).toBeFalsy();
	expect(flexValidator("none none")).toBeFalsy();
	expect(flexValidator("1 1 -10px")).toBeFalsy();
});

it("valid align-items values", () => {
	expect(alignItemsValidator("stretch")).toBeTruthy();
	expect(alignItemsValidator("center")).toBeTruthy();
	expect(alignItemsValidator("flex-start")).toBeTruthy();
	expect(alignItemsValidator("flex-end")).toBeTruthy();
	expect(alignItemsValidator("baseline")).toBeTruthy();
});

it("invalid align-items values", () => {
	expect(alignItemsValidator("top")).toBeFalsy();
	expect(alignItemsValidator("bottom")).toBeFalsy();
	expect(alignItemsValidator("middle")).toBeFalsy();
	expect(alignItemsValidator("flexstart")).toBeFalsy();
	expect(alignItemsValidator("centered")).toBeFalsy();
});

it("borderValidator should reject a multi-part value with unrecognized tokens", () => {
	expect(borderValidator("1px foo bar")).toBe(false);
});

it("borderValidator should return null for more than 3 parts", () => {
	expect(borderValidator("1px solid red extra")).toBeFalsy();
});

it("fontFamilyValidator should reject a trailing comma", () => {
	expect(fontFamilyValidator("Arial, sans-serif,")).toBe(false);
});

it("flexValidator should accept a plain positive number as flex-basis", () => {
	expect(flexValidator("1 1 5")).toBeTruthy();
});

it("flexValidator should reject a negative number as flex-basis", () => {
	expect(flexValidator("1 1 -5")).toBeFalsy();
});

it("spacingValidator should accept keyword values", () => {
	expect(spacingValidator("normal")).toBe(true);
	expect(spacingValidator("inherit")).toBe(true);
	expect(spacingValidator("initial")).toBe(true);
	expect(spacingValidator("unset")).toBe(true);
});

it("spacingValidator should fall back to sizeValidator", () => {
	expect(spacingValidator("10px")).toBe(true);
	expect(spacingValidator("not-a-size")).toBe(false);
});

it("fontFamilyValidator should accept a comma-separated font list", () => {
	expect(fontFamilyValidator("Arial, sans-serif")).toBe(true);
	expect(fontFamilyValidator('"Times New Roman", serif')).toBe(true);
});

it("fontFamilyValidator should reject a list missing a comma between names", () => {
	expect(fontFamilyValidator("Arial sans-serif")).toBe(false);
});

it("fontFamilyValidator should reject a comma not followed by a valid font name", () => {
	expect(fontFamilyValidator("Arial,,serif")).toBe(false);
});

it("invalid values", () => {
	Object.entries(allowedCSSProperties).forEach(([, validator]) => {
		expect(validator("")).toBeFalsy();
		expect(validator(":")).toBeFalsy();
		expect(validator(";")).toBeFalsy();
	});
});
