import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it } from "vitest";

import { CustomButton } from "./CustomButton";

const CONTENT = [
	{
		type: "paragraph",
		align: "left",
		children: [{ text: "click me" }],
	},
];

describe("CustomButton", () => {
	it("renders an anchor with href/target based on url props", () => {
		render(
			<CustomButton
				backgroundColor="#fff"
				border={{}}
				color="#000"
				content={CONTENT}
				padding={{}}
				url={{ location: "https://example.com", openInNewTab: true }}
			/>,
		);

		const anchor = screen.getByText("click me").closest("a");
		expect(anchor?.getAttribute("href")).toBe("https://example.com");
		expect(anchor?.getAttribute("target")).toBe("_blank");
	});

	it("omits target when openInNewTab is false", () => {
		render(
			<CustomButton
				backgroundColor="#fff"
				border={{}}
				color="#000"
				content={CONTENT}
				padding={{}}
				url={{ location: "https://example.com", openInNewTab: false }}
			/>,
		);

		const anchor = screen.getByText("click me").closest("a");
		expect(anchor?.getAttribute("target")).toBeNull();
	});

	it("applies color to every leaf child when color is provided", () => {
		render(
			<CustomButton
				backgroundColor="#fff"
				border={{}}
				color="#ff0000"
				content={CONTENT}
				padding={{}}
				url={{ location: "#" }}
			/>,
		);

		const span = screen.getByText("click me");
		expect(span.style.color).toBe("rgb(255, 0, 0)");
	});

	it("does not crash when content is not an array (color merge skipped)", () => {
		render(
			<CustomButton
				backgroundColor="#fff"
				border={{}}
				color="#ff0000"
				content={{} as unknown as typeof CONTENT}
				padding={{}}
				url={{ location: "#" }}
			/>,
		);

		expect(screen.getByText("Error when rendering component")).not.toBeNull();
	});

	it("uses default border/padding when not provided", () => {
		const Untyped = CustomButton as React.FC<Record<string, unknown>>;

		expect(() =>
			render(
				<Untyped
					backgroundColor="#fff"
					color="#ff0000"
					content={CONTENT}
					url={{ location: "#" }}
				/>,
			),
		).not.toThrow();

		expect(screen.getByText("click me")).not.toBeNull();
	});

	it("leaves content unchanged when color is not provided", () => {
		render(
			<CustomButton
				backgroundColor="#fff"
				border={{}}
				color={undefined as unknown as string}
				content={CONTENT}
				padding={{}}
				url={{ location: "#" }}
			/>,
		);

		expect(screen.getByText("click me")).not.toBeNull();
	});
});
