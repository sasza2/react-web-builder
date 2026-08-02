import type { WebBuilderComponentProperty } from "types";
import { describe, expect, it } from "vitest";

import {
	createBackgroundColorProperty,
	createBorderProperty,
	createBoxShadowProperty,
	createColorProperty,
	createContentProperty,
	createPaddingProperty,
	createSourceProperty,
} from "./properties";

type PropertyOfType<Type extends WebBuilderComponentProperty["type"]> = Extract<
	WebBuilderComponentProperty,
	{ type: Type }
>;

const expectPropertyOfType = <Type extends WebBuilderComponentProperty["type"]>(
	property: WebBuilderComponentProperty,
	type: Type,
): PropertyOfType<Type> => {
	expect(property.type).toBe(type);
	return property as PropertyOfType<Type>;
};

describe("properties", () => {
	it("createContentProperty uses defaultBoxContent and merges options", () => {
		const prop = expectPropertyOfType(
			createContentProperty([], {
				colorAvailable: false,
				hyperlinkAvailable: true,
			}),
			"richtext",
		);
		expect(prop.id).toBe("content");
		expect(prop.defaultValue).toEqual([]);
		expect(prop.colorAvailable).toBe(false);
		expect(prop.hyperlinkAvailable).toBe(true);
	});

	it("createContentProperty defaults options to {}", () => {
		const prop = expectPropertyOfType(createContentProperty([]), "richtext");
		expect(prop.colorAvailable).toBeUndefined();
	});

	it("createColorProperty sets id/type/defaultValue", () => {
		const prop = createColorProperty("#123456");
		expect(prop).toMatchObject({
			id: "color",
			type: "color",
			defaultValue: "#123456",
		});
	});

	it("createBackgroundColorProperty uses provided defaultValue", () => {
		const prop = createBackgroundColorProperty("#abcdef");
		expect(prop.defaultValue).toBe("#abcdef");
	});

	it("createBackgroundColorProperty falls back when no defaultValue given", () => {
		const prop = createBackgroundColorProperty();
		expect(prop.defaultValue).toBe("#eeeeee");
	});

	it("createBackgroundColorProperty falls back on empty string defaultValue", () => {
		const prop = createBackgroundColorProperty("");
		expect(prop.defaultValue).toBe("#eeeeee");
	});

	it("createPaddingProperty merges partial defaultValue over base zeros", () => {
		const prop = createPaddingProperty({ top: 5 });
		expect(prop.defaultValue).toEqual({
			top: 5,
			right: 0,
			bottom: 0,
			left: 0,
		});
	});

	it("createPaddingProperty defaults to all zeros when no defaultValue given", () => {
		const prop = createPaddingProperty();
		expect(prop.defaultValue).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		});
	});

	it("createBorderProperty merges partial defaultValue over base", () => {
		const prop = createBorderProperty({ radius: 8 });
		expect(prop.defaultValue).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			color: "#dddddd",
			radius: 8,
		});
	});

	it("createBorderProperty defaults when no defaultValue given", () => {
		const prop = createBorderProperty();
		expect(prop.defaultValue).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
			color: "#dddddd",
			radius: 0,
		});
	});

	it("createBoxShadowProperty passes through defaultValue (including undefined)", () => {
		expect(createBoxShadowProperty("0 0 1px #000").defaultValue).toBe(
			"0 0 1px #000",
		);
		expect(createBoxShadowProperty().defaultValue).toBeUndefined();
	});

	it("createSourceProperty defaults location to empty string and passes openInNewTab", () => {
		const prop = expectPropertyOfType(createSourceProperty(), "url");
		expect(prop.defaultValue).toEqual({
			location: "",
			openInNewTab: undefined,
		});
		expect(prop.canOpenInNewTab).toBeUndefined();
	});

	it("createSourceProperty uses provided defaultValue and openInNewTab", () => {
		const prop = expectPropertyOfType(
			createSourceProperty("https://example.com", true),
			"url",
		);
		expect(prop.defaultValue).toEqual({
			location: "https://example.com",
			openInNewTab: true,
		});
		expect(prop.canOpenInNewTab).toBe(true);
	});
});
