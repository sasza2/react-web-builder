import { render, screen } from "@testing-library/react";
import React from "react";
import { afterEach, describe, expect, it } from "vitest";

import { ScaleAnimation } from "./ScaleAnimation";

const setInnerWidth = (width: number) => {
	Object.defineProperty(window, "innerWidth", {
		configurable: true,
		writable: true,
		value: width,
	});
};

describe("ScaleAnimation", () => {
	const originalWidth = window.innerWidth;

	afterEach(() => {
		setInnerWidth(originalWidth);
	});

	it("applies no transform when maxWidth fits within window width", () => {
		setInnerWidth(1000);

		render(
			<ScaleAnimation maxWidth={500}>
				<div>content</div>
			</ScaleAnimation>,
		);

		const node = screen.getByText("content").parentElement as HTMLElement;
		expect(node.style.transform).toBe("");
	});

	it("applies a scale transform when maxWidth exceeds window width", () => {
		setInnerWidth(400);

		render(
			<ScaleAnimation maxWidth={800}>
				<div>content</div>
			</ScaleAnimation>,
		);

		const node = screen.getByText("content").parentElement as HTMLElement;
		expect(node.style.transform).toBe("scale(0.5)");
	});
});
