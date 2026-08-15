import { describe, expect, it } from "vitest";

import { addBreakpoint, addBreakpointSilent } from "./breakpointsSlice";
import { pushChange, redoChanges, undoChanges } from "./changesSlice";
import { createStore } from "./store";

describe("changesMiddleware", () => {
	it("dispatching pushChange directly passes through without re-pushing", () => {
		const store = createStore({});
		const before = store.getState().changes.history.length;
		store.dispatch(
			pushChange({ action: { type: "noop" }, key: "k1", time: 1 }),
		);
		expect(store.getState().changes.history.length).toBe(before + 1);
	});

	it("dispatching a tracked action pushes a change entry", () => {
		const store = createStore({});
		const breakpoint = { id: "bp1" } as never;
		store.dispatch(addBreakpoint({ breakpoint }));

		expect(store.getState().breakpoints).toEqual([breakpoint]);
		expect(store.getState().changes.history).toHaveLength(1);
		expect(store.getState().changes.history[0].action.type).toBe(
			"breakpoints/addBreakpoint",
		);
	});

	it("dispatching an omitted action still records history but does not bump pushKey", () => {
		// `actionsToOmit` entries are part of `actions` (tracked for history),
		// but changesSlice's pushChanges skips updating `pushKey` for them.
		const store = createStore({});
		const breakpoint = { id: "bp1" } as never;
		const pushKeyBefore = store.getState().changes.pushKey;
		store.dispatch(addBreakpointSilent({ breakpoint }));

		expect(store.getState().breakpoints).toEqual([breakpoint]);
		expect(store.getState().changes.history).toHaveLength(1);
		expect(store.getState().changes.pushKey).toBe(pushKeyBefore);
	});

	it("undoChanges rebuilds state from history via a temporary store", () => {
		const store = createStore({});
		const bp1 = { id: "bp1" } as never;
		const bp2 = { id: "bp2" } as never;

		store.dispatch(addBreakpoint({ breakpoint: bp1 }));
		store.dispatch(addBreakpoint({ breakpoint: bp2 }));
		expect(store.getState().breakpoints).toEqual([bp1, bp2]);

		store.dispatch(undoChanges());

		expect(store.getState().breakpoints).toEqual([bp1]);
	});

	it("redoChanges replays a previously undone action", () => {
		const store = createStore({});
		const bp1 = { id: "bp1" } as never;

		store.dispatch(addBreakpoint({ breakpoint: bp1 }));
		store.dispatch(undoChanges());
		expect(store.getState().breakpoints).toEqual([]);

		store.dispatch(redoChanges());
		expect(store.getState().breakpoints).toEqual([bp1]);
	});
});
