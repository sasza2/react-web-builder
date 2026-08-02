import { afterEach, describe, expect, it, vi } from "vitest";

import { blurInput, hasFocusOnInput } from "./input";

describe("blurInput", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		vi.restoreAllMocks();
	});

	it("calls blur when activeElement supports it", () => {
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();

		const blurSpy = vi.spyOn(input, "blur");
		blurInput();

		expect(blurSpy).toHaveBeenCalled();
	});

	it("does nothing when activeElement has no blur function", () => {
		expect(() => blurInput()).not.toThrow();
	});

	it("does nothing when activeElement lacks a blur property", () => {
		vi.spyOn(document, "activeElement", "get").mockReturnValue(
			{} as unknown as Element,
		);

		expect(() => blurInput()).not.toThrow();
	});
});

describe("hasFocusOnInput", () => {
	afterEach(() => {
		document.body.innerHTML = "";
	});

	it("returns false when activeElement is body", () => {
		expect(hasFocusOnInput()).toBe(false);
	});

	it("returns true when activeElement is an input", () => {
		const input = document.createElement("input");
		document.body.appendChild(input);
		input.focus();

		expect(hasFocusOnInput()).toBe(true);
	});

	it("returns false when activeElement is not an input", () => {
		const div = document.createElement("div");
		div.tabIndex = 0;
		document.body.appendChild(div);
		div.focus();

		expect(hasFocusOnInput()).toBe(false);
	});
});
