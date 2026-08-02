import { describe, expect, it } from "vitest";
import reducer, {
	commitHistory,
	initialState,
	pushChange,
	redoChanges,
	setIsSaved,
	undoChanges,
} from "./changesSlice";
import {
	CHANGES_START_TRANSACTION_TYPE,
	CHANGES_STOP_TRANSACTION_TYPE,
} from "./changesTransactions";

const importantAction = (n: number) => ({
	type: `breakpoints/addBreakpoint${n}`,
});
const omittedAction = { type: "selectedElement/setSelectedElement" };

describe("changesSlice", () => {
	it("pushChange appends to history and bumps pushKey for non-omitted actions", () => {
		const next = reducer(
			initialState,
			pushChange({ action: importantAction(1), key: "k1", time: 1 }),
		);
		expect(next.history).toHaveLength(1);
		expect(next.index).toBe(1);
		expect(next.saved).toBe(false);
		expect(next.pushKey).not.toBe("");
	});

	it("pushChange does not bump pushKey for omitted actions", () => {
		const next = reducer(
			initialState,
			pushChange({ action: omittedAction, key: "k1", time: 1 }),
		);
		expect(next.pushKey).toBe("");
	});

	it("pushChange truncates future history when pushing after undo", () => {
		let state = reducer(
			initialState,
			pushChange({ action: importantAction(1), key: "k1", time: 1 }),
		);
		state = reducer(
			state,
			pushChange({ action: importantAction(2), key: "k2", time: 2 }),
		);
		state = reducer(state, undoChanges());
		expect(state.index).toBe(1);

		state = reducer(
			state,
			pushChange({ action: importantAction(3), key: "k3", time: 3 }),
		);
		expect(state.history).toHaveLength(2);
		expect(state.history[1].action).toEqual(importantAction(3));
	});

	it("pushChange inserts programmatic setElementsInBreakpointProgrammatic before last elementsInBreakpoints change", () => {
		let state = reducer(
			initialState,
			pushChange({
				action: { type: "elementsInBreakpoints/setElementsInBreakpoint" },
				key: "k1",
				time: 1,
			}),
		);
		state = reducer(
			state,
			pushChange({ action: importantAction(1), key: "k2", time: 2 }),
		);
		state = reducer(
			state,
			pushChange({
				action: {
					type: "elementsInBreakpoints/setElementsInBreakpointProgrammatic",
				},
				key: "k3",
				time: 3,
			}),
		);

		expect(state.history).toHaveLength(3);
		// inserted right after the last elementsInBreakpoints entry (index 0 -> splice at 1)
		expect(state.history[1].action.type).toBe(
			"elementsInBreakpoints/setElementsInBreakpointProgrammatic",
		);
	});

	it("pushChange marks elementsInBreakpoints flag based on action type prefix", () => {
		const next = reducer(
			initialState,
			pushChange({
				action: { type: "elementsInBreakpoints/addElementToBreakpoint" },
				key: "k1",
				time: 1,
			}),
		);
		expect(next.history[0].elementsInBreakpoints).toBe(true);
	});

	it("commitHistory resets to initial state with given initial payload", () => {
		const next = reducer(
			initialState,
			commitHistory({ initial: { foo: "bar" } }),
		);
		expect(next).toEqual({ ...initialState, initial: { foo: "bar" } });
	});

	it("setIsSaved marks saved true", () => {
		const state = { ...initialState, saved: false };
		const next = reducer(state, setIsSaved());
		expect(next.saved).toBe(true);
	});

	it("default case returns state unchanged", () => {
		expect(reducer(initialState, { type: "unknown" })).toBe(initialState);
	});

	describe("undoChanges", () => {
		const buildHistory = (
			actions: Array<{ type: string } | { type: string; time: number }>,
		) => {
			let state = initialState;
			actions.forEach((action, i) => {
				const time = "time" in action ? action.time : i;
				state = reducer(state, pushChange({ action, key: `k${i}`, time }));
			});
			return state;
		};

		it("moves index back by one for a plain important action", () => {
			const state = buildHistory([importantAction(1)]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
			expect(next.saved).toBe(false);
			expect(next.undoKey).not.toBe("");
		});

		it("skips over an entire transaction block (start..stop)", () => {
			const state = buildHistory([
				importantAction(1),
				{ type: CHANGES_START_TRANSACTION_TYPE },
				importantAction(2),
				importantAction(3),
				{ type: CHANGES_STOP_TRANSACTION_TYPE },
			]);
			const next = reducer(state, undoChanges());
			// should skip past the whole transaction, landing before it (index 1)
			expect(next.index).toBe(1);
		});

		it("skips consecutive addElementToBreakpoint + setElementsInBreakpoint within 1000ms", () => {
			const state = buildHistory([
				{ type: "elementsInBreakpoints/addElementToBreakpoint", time: 100 },
				{ type: "elementsInBreakpoints/setElementsInBreakpoint", time: 200 },
			]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
		});

		it("skips updatePageSettings + setElementsInBreakpoint pairing", () => {
			const state = buildHistory([
				{ type: "pageSettings/updatePageSettings" },
				{ type: "elementsInBreakpoints/setElementsInBreakpoint" },
			]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
		});

		it("skips setSelectedElements with empty elementsIds (start resizing)", () => {
			const state = buildHistory([
				importantAction(1),
				{
					type: "selectedElements/setSelectedElements",
					payload: { elementsIds: [] },
				},
			]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
		});

		it("does not skip setSelectedElements with a non-empty elementsIds payload", () => {
			const state = buildHistory([
				{
					type: "selectedElements/setSelectedElements",
					payload: { elementsIds: ["e1"] },
				},
			]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
		});

		it("continues past an omitted action then stops at the important one below it", () => {
			const state = buildHistory([importantAction(1), omittedAction]);
			const next = reducer(state, undoChanges());
			expect(next.index).toBe(0);
		});

		it("no-op on empty history", () => {
			const next = reducer(initialState, undoChanges());
			expect(next.index).toBe(0);
		});
	});

	describe("redoChanges", () => {
		const buildUndoneHistory = (
			actions: Array<{ type: string } | { type: string; time: number }>,
		) => {
			let state = initialState;
			actions.forEach((action, i) => {
				const time = "time" in action ? action.time : i;
				state = reducer(state, pushChange({ action, key: `k${i}`, time }));
			});
			state = { ...state, index: 0 };
			return state;
		};

		it("moves index forward for a plain important action", () => {
			const state = buildUndoneHistory([importantAction(1)]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(1);
			expect(next.undoKey).not.toBe("");
		});

		it("skips an entire transaction block (start..stop)", () => {
			const state = buildUndoneHistory([
				{ type: CHANGES_START_TRANSACTION_TYPE },
				importantAction(2),
				importantAction(3),
				{ type: CHANGES_STOP_TRANSACTION_TYPE },
				importantAction(4),
			]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(5);
		});

		it("skips ahead when next entry is setElementsInBreakpointProgrammatic", () => {
			const state = buildUndoneHistory([
				importantAction(1),
				{ type: "elementsInBreakpoints/setElementsInBreakpointProgrammatic" },
			]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(2);
		});

		it("skips addElementToBreakpoint followed closely by setElementsInBreakpoint", () => {
			const state = buildUndoneHistory([
				{ type: "elementsInBreakpoints/addElementToBreakpoint", time: 100 },
				{ type: "elementsInBreakpoints/setElementsInBreakpoint", time: 200 },
			]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(2);
		});

		it("skips updatePageSettings followed by setElementsInBreakpoint", () => {
			const state = buildUndoneHistory([
				{ type: "pageSettings/updatePageSettings" },
				{ type: "elementsInBreakpoints/setElementsInBreakpoint" },
			]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(2);
		});

		it("skips setSelectedElements with empty elementsIds", () => {
			const state = buildUndoneHistory([
				{
					type: "selectedElements/setSelectedElements",
					payload: { elementsIds: [] },
				},
				importantAction(2),
			]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(2);
		});

		it("continues past an omitted action then stops on the important one after it", () => {
			const state = buildUndoneHistory([omittedAction, importantAction(2)]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(2);
		});

		it("no-op on already-latest index", () => {
			const state = buildHistoryAtEnd([importantAction(1)]);
			const next = reducer(state, redoChanges());
			expect(next.index).toBe(state.index);
		});

		function buildHistoryAtEnd(actions: Array<{ type: string }>) {
			let state = initialState;
			actions.forEach((action, i) => {
				state = reducer(state, pushChange({ action, key: `k${i}`, time: i }));
			});
			return state;
		}
	});
});
