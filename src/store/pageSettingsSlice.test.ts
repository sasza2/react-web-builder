import { describe, expect, it } from "vitest";

import reducer, {
	replacePageSettings,
	setPageSettings,
	updatePageSettings,
} from "./pageSettingsSlice";

describe("pageSettingsSlice", () => {
	it("updatePageSettings merges into state", () => {
		const state = { title: "a" } as never;
		const next = reducer(
			state,
			updatePageSettings({ pageSettings: { subtitle: "b" } as never }),
		);
		expect(next).toEqual({ title: "a", subtitle: "b" });
	});

	it("setPageSettings replaces state", () => {
		const state = { title: "a" } as never;
		const next = reducer(
			state,
			setPageSettings({ pageSettings: { title: "c" } as never }),
		);
		expect(next).toEqual({ title: "c" });
	});

	it("replacePageSettings replaces state", () => {
		const next = reducer(
			{} as never,
			replacePageSettings({ title: "z" } as never),
		);
		expect(next).toEqual({ title: "z" });
	});

	it("default case returns state unchanged", () => {
		const state = { title: "a" } as never;
		expect(reducer(state, { type: "unknown" })).toBe(state);
	});
});
