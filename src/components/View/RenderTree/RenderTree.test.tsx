import { render, screen } from "@testing-library/react";
import React from "react";
import type { Breakpoint, Tree, WebBuilderComponent } from "types";
import { describe, expect, it, vi } from "vitest";

vi.mock("../Element", () => ({
	default: ({ element }: { element: { id: string } }) => (
		<div data-testid="element">{element.id}</div>
	),
}));

vi.mock("./styles/breakpoint", () => ({
	getStyleForBreakpoint: vi.fn(() => ({ opacity: 1 })),
}));

vi.mock("./styles/fixed", () => ({
	getStyleForFixedParent: vi.fn(() => ({ position: "relative" })),
	getStyleForFixedChild: vi.fn(() => ({ position: "absolute" })),
}));

import { RenderTree } from "./RenderTree";

const BREAKPOINT = { id: "bp-1" } as Breakpoint;
const COMPONENTS: WebBuilderComponent[] = [];

describe("RenderTree", () => {
	it("returns null when node is falsy", () => {
		const { container } = render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={null as unknown as Tree}
				transformElementProperty={undefined}
			/>,
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders a row node with a flex-column wrapper and recurses children", () => {
		const node = {
			id: "row-1",
			type: "row",
			children: [
				{
					id: "c1",
					type: "component",
					element: { id: "el-1", componentName: "Text" },
				},
			],
		} as unknown as Tree;

		render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(document.querySelector(".react-web-builder-row")).not.toBeNull();
		expect(screen.getByText("el-1")).not.toBeNull();
	});

	it("renders a column node with a flex-row wrapper and recurses children", () => {
		const node = {
			id: "col-1",
			type: "column",
			children: [
				{
					id: "c1",
					type: "component",
					element: { id: "el-2", componentName: "Text" },
				},
			],
		} as unknown as Tree;

		render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(document.querySelector(".react-web-builder-column")).not.toBeNull();
		expect(screen.getByText("el-2")).not.toBeNull();
	});

	it("renders a component node via Element", () => {
		const node = {
			id: "comp-1",
			type: "component",
			paddingBottom: 5,
			element: { id: "el-3", componentName: "Text" },
		} as unknown as Tree;

		render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(screen.getByText("el-3")).not.toBeNull();
	});

	it("returns null for a component node whose componentName is Separator", () => {
		const node = {
			id: "comp-2",
			type: "component",
			element: { id: "el-4", componentName: "Separator" },
		} as unknown as Tree;

		const { container } = render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders a fixed node with children via Element", () => {
		const node = {
			id: "fixed-1",
			type: "fixed",
			children: [
				{
					id: "child-1",
					paddingBottom: 0,
					element: { id: "el-5", componentName: "Text" },
				},
			],
		} as unknown as Tree;

		render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(screen.getByText("el-5")).not.toBeNull();
	});

	it("returns null for an unknown node type", () => {
		const node = { id: "x", type: "unknown-type" } as unknown as Tree;

		const { container } = render(
			<RenderTree
				breakpoint={BREAKPOINT}
				components={COMPONENTS}
				node={node}
				transformElementProperty={undefined}
			/>,
		);

		expect(container.firstChild).toBeNull();
	});
});
