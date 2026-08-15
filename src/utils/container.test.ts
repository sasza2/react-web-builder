import type { Breakpoint } from "types";
import { describe, expect, it, vi } from "vitest";

import { addElementReference } from "@/components/View/elementsRefMap";

import {
	createElementsForContainer,
	createTreeForContainer,
	getContainerExtras,
	getDefaultContainer,
} from "./container";

const t = ((key: string) => key) as never;

describe("getDefaultContainer", () => {
	it("builds a default container from the parent breakpoint", () => {
		const parent = {
			id: "parent-1",
			cols: 10,
			from: 360,
			rowHeight: 15,
		} as Breakpoint;

		expect(getDefaultContainer(parent)).toEqual({
			id: "default-container",
			cols: 10,
			from: 360,
			rowHeight: 15,
			padding: { top: 0, right: 0, bottom: 0, left: 0 },
			parentId: "parent-1",
			to: null,
		});
	});
});

describe("createTreeForContainer", () => {
	it("builds a predefined tree with translated text", () => {
		const tree = createTreeForContainer(10, t);

		expect(tree.id).toBe("predefined-row-1");
		expect(tree.children).toHaveLength(3);
		expect(tree.children[0].element.componentName).toBe("Box");
	});
});

describe("getContainerExtras", () => {
	it("returns null when no elements reference map exists", () => {
		expect(getContainerExtras({ id: "no-refs" } as Breakpoint, 1)).toBeNull();
	});

	it("computes height and paddingBottom for referenced elements", () => {
		const breakpoint = { id: "bp-extras", rowHeight: 10 } as Breakpoint;
		const wrapper = document.createElement("div");
		const child = document.createElement("div");
		vi.spyOn(child, "getBoundingClientRect").mockReturnValue({
			height: 100,
		} as DOMRect);
		wrapper.appendChild(child);
		document.body.appendChild(wrapper);

		addElementReference(breakpoint, { id: "el-1" } as never, wrapper);

		const extras = getContainerExtras(breakpoint, 1);

		expect(extras["el-1"].height).toBe(10);
		expect(extras["el-1"].paddingBottom).toBe(0);
	});
});

describe("createElementsForContainer", () => {
	it("creates positioned elements for the predefined tree", () => {
		const parent = {
			id: "parent-1",
			cols: 10,
			from: 360,
			rowHeight: 15,
		} as Breakpoint;
		const container = { id: "container-1", cols: 10 } as Breakpoint;

		const defaultContainer = getDefaultContainer(parent);
		const wrapper = document.createElement("div");
		const child = document.createElement("div");
		vi.spyOn(child, "getBoundingClientRect").mockReturnValue({
			height: 15,
		} as DOMRect);
		wrapper.appendChild(child);
		document.body.appendChild(wrapper);

		const tree = createTreeForContainer(container.cols, t);
		tree.children.forEach((childTree) => {
			addElementReference(defaultContainer, childTree.element, wrapper);
		});

		const { elements, getPaddingBottom, measureContainerElement } =
			createElementsForContainer(container, parent, t);

		expect(elements).toHaveLength(3);
		elements.forEach((element) => {
			expect(element.breakpointId).toBe("container-1");
			expect(measureContainerElement(element.id)).toBe(1);
			expect(getPaddingBottom(element.id)).toBe(0);
		});
	});
});
