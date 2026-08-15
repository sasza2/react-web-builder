import { beforeEach, describe, expect, it } from "vitest";

import { clearHintsFromLocalStorage } from "./clearHintsFromLocalStorage";

describe("clearHintsFromLocalStorage", () => {
	beforeEach(() => {
		localStorage.clear();
	});

	it("removes the hint keys for each item in the list", () => {
		localStorage.setItem("hint-.a", "true");
		localStorage.setItem("hint-.b", "true");

		clearHintsFromLocalStorage([{ selector: ".a", title: "A" }]);

		expect(localStorage.getItem("hint-.a")).toBeNull();
		expect(localStorage.getItem("hint-.b")).toBe("true");
	});

	it("does nothing when the list is empty", () => {
		localStorage.setItem("hint-.a", "true");

		clearHintsFromLocalStorage([]);

		expect(localStorage.getItem("hint-.a")).toBe("true");
	});
});
