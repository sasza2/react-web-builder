import { expect, it } from "vitest";

import { get, set } from "./field";

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
