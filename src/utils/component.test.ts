import type { WebBuilderComponent } from "types";
import { describe, expect, it } from "vitest";

import { isContainerComponent, prepareComponents } from "./component";

describe("prepareComponents", () => {
	it("keeps component as-is when props already defined", () => {
		const components = [
			{ id: "a", props: [{ name: "x" }] },
		] as unknown as WebBuilderComponent[];

		expect(prepareComponents(components)).toEqual(components);
	});

	it("adds empty props array when missing", () => {
		const components = [{ id: "a" }] as unknown as WebBuilderComponent[];

		expect(prepareComponents(components)).toEqual([{ id: "a", props: [] }]);
	});
});

describe("isContainerComponent", () => {
	const components = [
		{ id: "a", isContainer: true },
		{ id: "b", isContainer: false },
	] as unknown as WebBuilderComponent[];

	it("returns true when component is container", () => {
		expect(isContainerComponent("a", components)).toBe(true);
	});

	it("returns false when component is not container", () => {
		expect(isContainerComponent("b", components)).toBe(false);
	});

	it("returns false when component not found", () => {
		expect(isContainerComponent("c", components)).toBe(false);
	});
});
