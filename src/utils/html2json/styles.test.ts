import { expect, it } from "vitest";

import { initErrorsInstance } from "./errors";
import {
	isValidSelector,
	transformSelector,
	transformStyles,
	transformStylesForReact,
} from "./styles";

it("should replace body/html/:root selectors with the prefix class", () => {
	expect(transformSelector("body", "builder")).toBe(".builder");
	expect(transformSelector("html", "builder")).toBe(".builder");
	expect(transformSelector(":root", "builder")).toBe(".builder");
});

it("should prefix a bare tag selector that maps to a different tag", () => {
	expect(transformSelector("footer", "builder")).toBe(
		".builder .builder-footer",
	);
});

it("should return safe styles", () => {
	expect(
		transformStyles([
			{
				prop: "background-image",
				value: "url(something.png)",
			},
			{
				prop: "width",
				value: "abc",
			},
			{
				prop: "font-weight",
				value: "bold",
			},
			{
				prop: "display",
				value: "flex",
			},
		]),
	).toStrictEqual({ "font-weight": "bold", display: "flex" });

	expect(
		transformStyles([
			{
				prop: "width",
				value: "200px",
			},
		]),
	).toStrictEqual({ width: "200px" });

	expect(
		transformStylesForReact([
			{
				prop: "font-weight",
				value: "bold",
			},
		]),
	).toStrictEqual({ fontWeight: "bold" });
});

const validSelectors = [
	".valid-class",
	"div#id:hover",
	".hello--a, .another-class",
	".class name",
	'[type="text"]',
	"ul > li.active",
	'input[type="checkbox"]:checked',
	"article h2::first-line",
	'[data-attr="val with spaces"]',
	'div[class~="foo"]',
	"body > header + main",
];

const invalidSelectors = [
	"@media",
	"@import",
	".bad|name",
	"svg|circle",
	"",
	".class..another",
	"*|*",
	"#",
	".",
	">",
	".a\\@b",
	":hover,",
	"[type=]",
	"[type",
	":nth-child()",
	"div > > p",
	"a[href^=]",
	'a[href^="https"]:not(.disabled)',
	"section > *:nth-child(2n)",
	"#id\\:weird",
	".class\\#hash",
	"a:has(img)",
	"form :is(input, select, textarea)",
	"something *",
];

it("should report an error for an invalid CSS attribute name", () => {
	const errors = initErrorsInstance();

	expect(
		transformStyles(
			[
				{
					prop: "123-invalid",
					value: "red",
				},
			],
			errors,
		),
	).toStrictEqual({});

	expect(errors.errors).toStrictEqual([
		{
			type: "UnsupportedCSSAttribute",
			prop: "123-invalid",
		},
	]);
});

it("should return false when the selectorParser AST throws", () => {
	// A selector ending with a combinator is caught via previousWasCombinator
	// logic (lastWasCombinator branch), covering the "trailing combinator"
	// invalid path.
	expect(isValidSelector("div >")).toBe(false);
});

it("should return false for selectors with empty class/id/operator values when document is unavailable", () => {
	const originalDocument = global.document;
	// @ts-expect-error simulate a non-browser (SSR) environment
	delete global.document;

	try {
		expect(isValidSelector(".foo.")).toBe(false);
		expect(isValidSelector("a[href=]")).toBe(false);
		expect(isValidSelector("div >")).toBe(false);
		expect(isValidSelector("a::")).toBe(false);
	} finally {
		global.document = originalDocument;
	}
});

it("should return true for valid selectors", () => {
	validSelectors.forEach((selector) => {
		expect(isValidSelector(selector)).toBe(true);
	});
});

it("should return false for invalid selectors", () => {
	invalidSelectors.forEach((selector) => {
		expect(isValidSelector(selector)).toBe(false);
	});
});
