import { expect, it } from "vitest";

import { get, normalizeInt, set } from "./field";

it("should return defaultValue when obj is falsy", () => {
	expect(get(null, "a.b", "fallback")).toBe("fallback");
});

it("should return defaultValue when path segment is undefined", () => {
	const obj = { a: {} };

	expect(get(obj, "a.b.c", "fallback")).toBe("fallback");
});

it("should normalize a string to an int", () => {
	expect(normalizeInt("42")).toBe(42);
});

it("should normalize an invalid string to 0", () => {
	expect(normalizeInt("abc")).toBe(0);
});

it("should set valid value", () => {
	const obj = {};

	expect(set(obj, "a", 10)).toStrictEqual({ a: 10 });
});

it("should set valid value", () => {
	const obj = {};

	expect(set(obj, "aa.b.c.d", 10)).toStrictEqual({
		aa: { b: { c: { d: 10 } } },
	});
});

it("should get valid value", () => {
	const obj = {
		aa: {
			b: {
				ccc: {
					d: 111,
				},
			},
		},
	};

	expect(get(obj, "aa.b.ccc.d")).toBe(111);
});

it("should set array index [0] value", () => {
	const obj = {};

	set(obj, "array.0.test", "name");

	expect(obj).toStrictEqual({ array: [{ test: "name" }] });
});

it("should set array index ([0], [1]) value", () => {
	const obj = {};

	set(obj, "array.0.test", "abc");
	set(obj, "array.1.test", "name");

	expect(obj).toStrictEqual({ array: [{ test: "abc" }, { test: "name" }] });
});

it("should set array index ([1] index) value", () => {
	const obj: { array: Array<{ test: string }> } = { array: [] };

	set(obj, "array.1.test", "name");

	obj.array[0] = undefined;

	expect(obj).toStrictEqual({ array: [undefined, { test: "name" }] });
});

it("should reuse existing nested object when setting deeper path twice", () => {
	const obj = { a: { b: { existing: true } } };

	expect(set(obj, "a.b.c", 10)).toStrictEqual({
		a: { b: { existing: true, c: 10 } },
	});
});
