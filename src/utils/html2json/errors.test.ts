import { expect, it } from "vitest";

import {
	initErrorsInstance,
	reportError,
	TransformErrorTypes,
	wrapError,
} from "./errors";

it("should add a new error", () => {
	const errors = initErrorsInstance();

	errors.add(
		wrapError({
			type: TransformErrorTypes.UnsupportedCSSAttribute,
			prop: "foo",
		}),
	);

	expect(errors.errors).toStrictEqual([
		{ type: TransformErrorTypes.UnsupportedCSSAttribute, prop: "foo" },
	]);
});

it("should not add a duplicate error", () => {
	const errors = initErrorsInstance();

	const wrapped = wrapError({
		type: TransformErrorTypes.UnsupportedCSSAttribute,
		prop: "foo",
	});

	errors.add(wrapped);
	errors.add(wrapped);
	errors.add(
		wrapError({
			type: TransformErrorTypes.UnsupportedCSSAttribute,
			prop: "foo",
		}),
	);

	expect(errors.errors).toHaveLength(1);
});

it("uniqueCode should return json representation of the error", () => {
	const wrapped = wrapError({
		type: TransformErrorTypes.UnsupportedCSSAttribute,
		prop: "foo",
	});

	expect(wrapped.uniqueCode()).toBe(JSON.stringify(wrapped.error));
});

it("reportError should add the error when instance provided", () => {
	const errors = initErrorsInstance();

	reportError(
		errors,
		wrapError({
			type: TransformErrorTypes.UnsupportedHTMLTagName,
			tagName: "iframe",
		}),
	);

	expect(errors.errors).toStrictEqual([
		{ type: TransformErrorTypes.UnsupportedHTMLTagName, tagName: "iframe" },
	]);
});

it("reportError should do nothing when instance is undefined", () => {
	expect(() =>
		reportError(
			undefined,
			wrapError({
				type: TransformErrorTypes.UnsupportedHTMLTagName,
				tagName: "iframe",
			}),
		),
	).not.toThrow();
});
