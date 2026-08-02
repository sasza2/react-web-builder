import { render, screen } from "@testing-library/react";
import React from "react";
import type { ILeaf } from "types";
import { describe, expect, it } from "vitest";

import { Leaf } from "./Leaf";

const GRADIENT = "linear-gradient(180deg, #ffaabb00 0%, #ccddee55 100%)";

describe("Leaf", () => {
	it("returns null when there are no children", () => {
		const { container } = render(
			<Leaf attributes={{}} leaf={{} as ILeaf}>
				{null}
			</Leaf>,
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders plain text content", () => {
		render(
			<Leaf attributes={{}} leaf={{} as ILeaf}>
				plain text
			</Leaf>,
		);

		expect(screen.getByText("plain text")).not.toBeNull();
	});

	it("wraps in a link when leaf.link is set and hyperlinkAvailable is not false", () => {
		render(
			<Leaf attributes={{}} leaf={{ link: "https://example.com" } as ILeaf}>
				link text
			</Leaf>,
		);

		const anchor = screen.getByText("link text").closest("a");
		expect(anchor).not.toBeNull();
		expect(anchor?.getAttribute("href")).toBe("https://example.com");
	});

	it("does not wrap in a link when hyperlinkAvailable is false", () => {
		render(
			<Leaf
				attributes={{}}
				hyperlinkAvailable={false}
				leaf={{ link: "https://example.com" } as ILeaf}
			>
				link text
			</Leaf>,
		);

		const anchor = screen.getByText("link text").closest("a");
		expect(anchor).toBeNull();
	});

	it("wraps children in strong/code/i/u for bold/code/italic/underline flags", () => {
		render(
			<Leaf
				attributes={{}}
				leaf={
					{
						bold: true,
						code: true,
						italic: true,
						underline: true,
					} as ILeaf
				}
			>
				styled
			</Leaf>,
		);

		const el = screen.getByText("styled");
		expect(el.tagName).toBe("STRONG");
		expect(el.closest("u")).not.toBeNull();
		expect(el.closest("i")).not.toBeNull();
		expect(el.closest("code")).not.toBeNull();
	});

	it("sets fontSize default of 12 when leaf.fontSize is not provided", () => {
		render(
			<Leaf attributes={{}} leaf={{} as ILeaf}>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.style.fontSize).toBe("12px");
	});

	it("applies a plain color and does not add the highlighted class for dark colors", () => {
		render(
			<Leaf attributes={{}} leaf={{ color: "#000000" } as ILeaf}>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.style.color).toBe("rgb(0, 0, 0)");
		expect(el.className).toBe("");
	});

	it("applies gradient color styles via background-clip", () => {
		render(
			<Leaf attributes={{}} leaf={{ color: GRADIENT } as ILeaf}>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.style.background).toContain("linear-gradient");
	});

	it("adds the highlighted class for a light color, appended to an existing className", () => {
		render(
			<Leaf
				attributes={{ className: "existing" }}
				leaf={{ color: "#ffffff" } as ILeaf}
			>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.className).toContain("existing");
		expect(el.className).toContain("react-web-builder-editor-higlighted");
	});

	it("adds the highlighted class alone when there is no existing className", () => {
		render(
			<Leaf attributes={{}} leaf={{ color: "#ffffff" } as ILeaf}>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.className).toBe("react-web-builder-editor-higlighted");
	});

	it("handles a falsy attributes prop without throwing", () => {
		expect(() =>
			render(
				<Leaf
					attributes={undefined as unknown as Record<string, unknown>}
					leaf={{} as ILeaf}
				>
					text
				</Leaf>,
			),
		).not.toThrow();

		expect(screen.getByText("text")).not.toBeNull();
	});

	it("does not apply color styling when colorAvailable is false", () => {
		render(
			<Leaf
				attributes={{}}
				colorAvailable={false}
				leaf={{ color: "#ffffff" } as ILeaf}
			>
				text
			</Leaf>,
		);

		const el = screen.getByText("text");
		expect(el.style.color).toBe("");
	});
});
