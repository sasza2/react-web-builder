import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseHTMLTransform = vi.fn();

vi.mock("@/hooks/useHTMLTransform", () => ({
	useHTMLTransform: (...args: unknown[]) => mockUseHTMLTransform(...args),
}));

vi.mock("@/utils/html2json/consts", () => ({
	ALLOWED_TAGS_VALUES: ["div", "img", "fragment"],
}));

import { HTMLComponent } from "./HTMLComponent";

const element = { id: "el-1" } as never;

describe("HTMLComponent", () => {
	it("renders text nodes", () => {
		mockUseHTMLTransform.mockReturnValue([
			[{ key: "1", type: "text", text: "hello world" }],
			null,
		]);

		const { container } = render(
			<HTMLComponent
				element={element}
				html={{ value: "hello world" } as never}
			/>,
		);

		expect(container.textContent).toBe("hello world");
	});

	it("renders element nodes with allowed tag and attributes, recursing into children", () => {
		mockUseHTMLTransform.mockReturnValue([
			[
				{
					key: "1",
					type: "element",
					tagName: "div",
					attributes: {
						className: "foo",
						height: undefined,
						href: undefined,
						src: undefined,
						width: undefined,
					},
					style: { color: "red" },
					children: [{ key: "2", type: "text", text: "child" }],
				},
			],
			null,
		]);

		const { container } = render(
			<HTMLComponent
				element={element}
				html={{ value: "<div>child</div>" } as never}
			/>,
		);

		const div = container.querySelector("div.foo");
		expect(div).not.toBeNull();
		expect(div?.textContent).toBe("child");
	});

	it("returns null for disallowed tag names", () => {
		mockUseHTMLTransform.mockReturnValue([
			[
				{
					key: "1",
					type: "element",
					tagName: "script",
					attributes: {},
					style: {},
					children: [],
				},
			],
			null,
		]);

		const { container } = render(
			<HTMLComponent
				element={element}
				html={{ value: "<script></script>" } as never}
			/>,
		);

		expect(container.querySelector("script")).toBeNull();
	});

	it("renders fragment tagName as children directly without wrapping element", () => {
		mockUseHTMLTransform.mockReturnValue([
			[
				{
					key: "1",
					type: "element",
					tagName: "fragment",
					attributes: {},
					style: {},
					children: [{ key: "2", type: "text", text: "fragment-child" }],
				},
			],
			null,
		]);

		const { container } = render(
			<HTMLComponent
				element={element}
				html={{ value: "fragment-child" } as never}
			/>,
		);

		expect(container.textContent).toBe("fragment-child");
	});

	it("renders element nodes without children as undefined children (leaf tags)", () => {
		mockUseHTMLTransform.mockReturnValue([
			[
				{
					key: "1",
					type: "element",
					tagName: "img",
					attributes: { src: "a.png" },
					style: {},
					children: [],
				},
			],
			null,
		]);

		const { container } = render(
			<HTMLComponent element={element} html={{ value: "<img />" } as never} />,
		);

		expect(container.querySelector("img")).not.toBeNull();
	});

	it("renders style nodes with selector + style entries", () => {
		mockUseHTMLTransform.mockReturnValue([
			[
				{
					key: "1",
					type: "style",
					children: [
						{
							selector: ".foo",
							style: { color: "red", background: "blue" },
						},
					],
				},
			],
			null,
		]);

		const { container } = render(
			<HTMLComponent
				element={element}
				html={{ value: "<style>.foo{}</style>" } as never}
			/>,
		);

		const styleTag = container.querySelector("style");
		expect(styleTag).not.toBeNull();
		expect(styleTag?.textContent).toContain(".foo");
		expect(styleTag?.textContent).toContain("color: red");
	});

	it("returns null for unknown node type (default branch)", () => {
		mockUseHTMLTransform.mockReturnValue([
			[{ key: "1", type: "unknown" } as never],
			null,
		]);

		const { container } = render(
			<HTMLComponent element={element} html={{ value: "" } as never} />,
		);

		expect(
			container.querySelector(`.react-web-builder-html-element-${element.id}`),
		).not.toBeNull();
	});
});
