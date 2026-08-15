import { describe, expect, it } from "vitest";
import { mergeArrays } from "./array";

describe("mergeArrays", () => {
	it("merges items with same id using spread by default", () => {
		const result = mergeArrays([[{ id: "1", a: 1 }], [{ id: "1", b: 2 }]]);
		expect(result).toEqual([{ id: "1", a: 1, b: 2 }]);
	});

	it("keeps items with unique ids", () => {
		const result = mergeArrays([[{ id: "1" }], [{ id: "2" }]]);
		expect(result).toEqual([{ id: "1" }, { id: "2" }]);
	});

	it("skips falsy lists", () => {
		const result = mergeArrays([
			[{ id: "1" }],
			undefined as unknown as { id: string }[],
		]);
		expect(result).toEqual([{ id: "1" }]);
	});

	it("uses custom mergeItem when provided", () => {
		const mergeItem = (
			a: { id: string; count: number },
			b: { id: string; count: number },
		) => ({
			id: a.id,
			count: a.count + b.count,
		});
		const result = mergeArrays(
			[[{ id: "1", count: 1 }], [{ id: "1", count: 2 }]],
			mergeItem,
		);
		expect(result).toEqual([{ id: "1", count: 3 }]);
	});
});
