import { render, screen } from "@testing-library/react";
import React from "react";
import type { BoxProps } from "types";
import { describe, expect, it } from "vitest";

import { Box } from "./Box";

describe("Box", () => {
	it("renders plain string content directly", () => {
		render(<Box content={"hello world" as unknown as BoxProps["content"]} />);

		expect(screen.getByText("hello world")).not.toBeNull();
	});

	it("renders an error placeholder when content is not a string or array", () => {
		render(<Box content={{} as unknown as BoxProps["content"]} />);

		expect(screen.getByText("Error when rendering component")).not.toBeNull();
	});

	it("renders an Empty placeholder for content items with no non-empty text children", () => {
		const content = [
			{
				type: "paragraph",
				align: "left",
				children: [{ text: "" }],
			},
		] as unknown as BoxProps["content"];

		const { container } = render(<Box content={content} />);

		expect(
			container.querySelector(".react-web-builder-component-box"),
		).not.toBeNull();
		expect(container.textContent).toBe("");
	});

	it("renders Element/Leaf tree for content items with text", () => {
		const content = [
			{
				type: "paragraph",
				align: "left",
				children: [{ text: "hello" }, { text: "" }],
			},
		] as unknown as BoxProps["content"];

		render(<Box content={content} />);

		expect(screen.getByText("hello")).not.toBeNull();
	});

	it("applies computed style from useBoxStyle (via backgroundColor)", () => {
		const content = [
			{
				type: "paragraph",
				align: "left",
				children: [{ text: "hi" }],
			},
		] as unknown as BoxProps["content"];

		const { container } = render(
			<Box content={content} backgroundColor="#ff0000" />,
		);

		const boxDiv = container.querySelector(
			".react-web-builder-component-box",
		) as HTMLElement;
		expect(boxDiv.style.background).toBe("rgb(255, 0, 0)");
	});
});
