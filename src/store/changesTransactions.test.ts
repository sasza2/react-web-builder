import { describe, expect, it } from "vitest";

import {
	CHANGES_START_TRANSACTION_TYPE,
	CHANGES_STOP_TRANSACTION_TYPE,
	changesStartTransaction,
	changesStopTransaction,
} from "./changesTransactions";

describe("changesTransactions", () => {
	it("changesStartTransaction returns action with correct type", () => {
		expect(changesStartTransaction()).toEqual({
			type: CHANGES_START_TRANSACTION_TYPE,
		});
	});

	it("changesStopTransaction returns action with correct type", () => {
		expect(changesStopTransaction()).toEqual({
			type: CHANGES_STOP_TRANSACTION_TYPE,
		});
	});
});
