import { describe, expect, it } from "vitest";

import { isValidLink } from "./link";

describe("isValidLink", () => {
	it("returns false when link is missing", () => {
		expect(isValidLink()).toBe(false);
		expect(isValidLink("")).toBe(false);
	});

	it("returns true for relative links", () => {
		expect(isValidLink("/page")).toBe(true);
	});

	it("returns true for anchor links", () => {
		expect(isValidLink("#section")).toBe(true);
	});

	it("returns true for mailto links", () => {
		expect(isValidLink("mailto:test@example.com")).toBe(true);
	});

	it("returns true for https links", () => {
		expect(isValidLink("https://example.com")).toBe(true);
	});

	it("returns false for other links", () => {
		expect(isValidLink("http://example.com")).toBe(false);
	});
});
