import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { Element } from "./Element";

const baseElement = {
	align: "center",
	type: "paragraph",
	letterSpacing: "",
	lineHeight: "",
};

describe("Element", () => {
	it.each([
		["block-quote", "BLOCKQUOTE"],
		["bulleted-list", "UL"],
		["heading-one", "H1"],
		["heading-two", "H2"],
		["list-item", "LI"],
		["numbered-list", "OL"],
		["anything-else", "P"],
	])("renders the correct tag for type=%s", (type, tagName) => {
		render(
			<Element attributes={{}} element={{ ...baseElement, type }}>
				content
			</Element>,
		);

		const el = screen.getByText("content");
		expect(el.tagName).toBe(tagName);
	});

	it("applies textAlign/letterSpacing/lineHeight from the element and falls back to defaults", () => {
		render(
			<Element attributes={{}} element={baseElement}>
				content
			</Element>,
		);

		const el = screen.getByText("content");
		expect(el.style.textAlign).toBe("center");
		expect(el.style.letterSpacing).not.toBe("");
		expect(el.style.lineHeight).not.toBe("");
	});

	it("spreads extra attributes onto the rendered element", () => {
		render(
			<Element attributes={{ "data-testid": "custom" }} element={baseElement}>
				content
			</Element>,
		);

		expect(screen.getByTestId("custom")).not.toBeNull();
	});
});
