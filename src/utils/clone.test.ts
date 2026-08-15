import { describe, expect, it } from "vitest";
import { cloneDeep } from "./clone";

describe("cloneDeep", () => {
	it("returns a deep clone that is not referentially equal", () => {
		const obj = { a: 1, nested: { b: 2 } };
		const cloned = cloneDeep(obj);
		expect(cloned).toEqual(obj);
		expect(cloned).not.toBe(obj);
		expect(cloned.nested).not.toBe(obj.nested);
	});
});
