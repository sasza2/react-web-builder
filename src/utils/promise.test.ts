import { describe, expect, it } from "vitest";

import { withResolvers } from "./promise";

describe("withResolvers", () => {
	it("resolves the promise when resolve is called", async () => {
		const { promise, resolve } = withResolvers();
		resolve();
		await expect(promise).resolves.toBeUndefined();
	});

	it("rejects the promise when reject is called", async () => {
		const { promise, reject } = withResolvers();
		promise.catch(() => {});
		reject();
		await expect(promise).rejects.toBeUndefined();
	});
});
