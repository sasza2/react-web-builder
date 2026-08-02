import { describe, expect, it } from "vitest";

import { createStore } from "./store";

describe("store", () => {
	it("createStore builds a working store with preloaded state", () => {
		const store = createStore({ pageSettings: { title: "a" } as never });
		expect(store.getState().pageSettings).toEqual({ title: "a" });
	});

	it("createStore includes changesMiddleware (pushChange history updates on tracked action)", () => {
		const store = createStore({});
		store.dispatch({
			type: "breakpoints/addBreakpoint",
			payload: { breakpoint: { id: "bp1" } },
		});
		expect(store.getState().changes.history.length).toBe(1);
	});
});
