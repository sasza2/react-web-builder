import { render } from "@testing-library/react";
import React from "react";
import type {
	Breakpoint,
	WebBuilderComponent,
	WebBuilderElement,
	WebBuilderElementProperty,
} from "types";
import { describe, expect, it } from "vitest";

import {
	getDefaultHeight,
	getDefaultValue,
	getDefaultWidth,
	getElementContainerIdProp,
	getElementFromList,
	getElementPropsWhenCreating,
	getElementsAboveRow,
	getElementsBelowRow,
	getFirstElementBelowRow,
	getProperties,
	groupElementsById,
	hasAnyElementAtRowPosition,
	isResizable,
	isSeparator,
	produceRenderForElement,
	sortElements,
	withAutoFocus,
} from "./element";

const breakpoint = { cols: 10 } as Breakpoint;

describe("isSeparator", () => {
	it("returns true for Separator component", () => {
		expect(isSeparator({ id: "Separator" } as WebBuilderComponent)).toBe(true);
	});

	it("returns false for other components", () => {
		expect(isSeparator({ id: "Text" } as WebBuilderComponent)).toBe(false);
	});
});

describe("isResizable", () => {
	it("returns true by default", () => {
		expect(isResizable({} as WebBuilderComponent)).toBe(true);
	});

	it("returns false when explicitly disabled", () => {
		expect(isResizable({ resizable: false } as WebBuilderComponent)).toBe(
			false,
		);
	});
});

describe("getDefaultHeight", () => {
	it("returns 1 for separator", () => {
		expect(getDefaultHeight({ id: "Separator" } as WebBuilderComponent)).toBe(
			1,
		);
	});

	it('returns "auto" for other components', () => {
		expect(getDefaultHeight({ id: "Text" } as WebBuilderComponent)).toBe(
			"auto",
		);
	});
});

describe("getDefaultWidth", () => {
	it("returns breakpoint cols when no defaultWidth", () => {
		expect(getDefaultWidth({} as WebBuilderComponent, breakpoint)).toBe(10);
	});

	it("returns defaultWidth number when smaller than cols", () => {
		expect(
			getDefaultWidth({ defaultWidth: 4 } as WebBuilderComponent, breakpoint),
		).toBe(4);
	});

	it("calls defaultWidth function", () => {
		const component = {
			defaultWidth: () => 3,
		} as unknown as WebBuilderComponent;
		expect(getDefaultWidth(component, breakpoint)).toBe(3);
	});

	it("caps defaultWidth to cols when defaultWidth is greater", () => {
		expect(
			getDefaultWidth({ defaultWidth: 20 } as WebBuilderComponent, breakpoint),
		).toBe(10);
	});
});

describe("getDefaultValue", () => {
	it("calls defaultValue function", () => {
		expect(
			getDefaultValue({ defaultValue: () => "computed" } as never, breakpoint),
		).toBe("computed");
	});

	it("returns defaultValue when defined", () => {
		expect(getDefaultValue({ defaultValue: "abc" } as never, breakpoint)).toBe(
			"abc",
		);
	});

	it("returns empty array for array type", () => {
		expect(getDefaultValue({ type: "array" } as never, breakpoint)).toEqual([]);
	});

	it("returns empty object for object type", () => {
		expect(getDefaultValue({ type: "object" } as never, breakpoint)).toEqual(
			{},
		);
	});

	it("returns undefined otherwise", () => {
		expect(
			getDefaultValue({ type: "text" } as never, breakpoint),
		).toBeUndefined();
	});
});

describe("getElementPropsWhenCreating", () => {
	it("returns null value for color type props", () => {
		const component = {
			props: [{ id: "color-prop", type: "color" }],
		} as unknown as WebBuilderComponent;

		expect(getElementPropsWhenCreating(component, breakpoint)).toEqual([
			{ propId: "color-prop", value: null },
		]);
	});

	it("returns default value for other props", () => {
		const component = {
			props: [{ id: "text-prop", type: "text", defaultValue: "hi" }],
		} as unknown as WebBuilderComponent;

		expect(getElementPropsWhenCreating(component, breakpoint)).toEqual([
			{ propId: "text-prop", value: "hi" },
		]);
	});
});

describe("getProperties", () => {
	it("returns base props when component and element are missing", () => {
		expect(getProperties(undefined, breakpoint, undefined)).toEqual({
			breakpoint,
			component: undefined,
			element: undefined,
		});
	});

	it("merges component defaultValues and element prop values", () => {
		const component = {
			props: [{ id: "text-prop", defaultValue: "default" }],
		} as unknown as WebBuilderComponent;
		const element = {
			props: [{ propId: "text-prop", value: "custom" }],
		} as unknown as WebBuilderElement;

		const props = getProperties(component, breakpoint, element);

		expect(props.text_prop ?? props["text-prop"]).toBe("custom");
	});

	it("skips empty element prop values", () => {
		const element = {
			props: [
				{ propId: "a", value: undefined },
				{ propId: "b", value: null },
				{ propId: "c", value: "" },
			],
		} as unknown as WebBuilderElement;

		const props = getProperties(undefined, breakpoint, element);

		expect(props.a).toBeUndefined();
		expect(props.b).toBeUndefined();
		expect(props.c).toBeUndefined();
	});

	it("uses transformElementProperty when provided", () => {
		const component = {
			props: [{ id: "text-prop" }],
		} as unknown as WebBuilderComponent;
		const element = {
			props: [{ propId: "text-prop", value: "raw" }],
		} as unknown as WebBuilderElement;
		const transform = () => "transformed";

		const props = getProperties(component, breakpoint, element, transform);

		expect(props["text-prop"]).toBe("transformed");
	});
});

describe("produceRenderForElement", () => {
	it("returns ComponentNotFound render when component missing", () => {
		const element = { componentName: "Unknown" } as WebBuilderElement;

		const [Render, found] = produceRenderForElement([], breakpoint, element);

		expect(found).toBe(false);
		const { container } = render(<Render />);
		expect(container).toBeTruthy();
	});

	it("returns component render when found", () => {
		const TestComponent = () => <div>hello</div>;
		const components = [
			{
				id: "Text",
				isContainer: false,
				props: [],
				component: TestComponent,
			},
		] as unknown as WebBuilderComponent[];
		const element = {
			componentName: "Text",
			props: [],
		} as unknown as WebBuilderElement;

		const [Render, found] = produceRenderForElement(
			components,
			breakpoint,
			element,
		);

		expect(found).toBe(true);
		const { getByText } = render(<Render />);
		expect(getByText("hello").textContent).toBe("hello");
	});
});

describe("row helpers", () => {
	const elements = [
		{ id: "1", y: 0 },
		{ id: "2", y: 5 },
		{ id: "3", y: 10 },
	] as unknown as WebBuilderElement[];

	it("getElementsBelowRow filters elements below row", () => {
		expect(getElementsBelowRow(elements, 5)).toEqual([elements[2]]);
	});

	it("getElementsAboveRow filters elements above row", () => {
		expect(getElementsAboveRow(elements, 5)).toEqual([elements[0]]);
	});

	it("getFirstElementBelowRow returns null when none below", () => {
		expect(getFirstElementBelowRow(elements, 100)).toBeNull();
	});

	it("getFirstElementBelowRow returns the closest element below", () => {
		expect(getFirstElementBelowRow(elements, 4)).toEqual(elements[1]);
	});
});

describe("groupElementsById", () => {
	it("groups elements keyed by id", () => {
		const elements = [
			{ id: "a" },
			{ id: "b" },
		] as unknown as WebBuilderElement[];

		expect(groupElementsById(elements)).toEqual({
			a: elements[0],
			b: elements[1],
		});
	});
});

describe("hasAnyElementAtRowPosition", () => {
	const elements = [{ id: "1", y: 2 }] as unknown as WebBuilderElement[];

	it("returns true when an element occupies the row", () => {
		expect(hasAnyElementAtRowPosition(elements, 3, () => 2)).toBe(true);
	});

	it("returns false when no element occupies the row", () => {
		expect(hasAnyElementAtRowPosition(elements, 10, () => 2)).toBe(false);
	});

	it("defaults height to 1 when measure returns falsy", () => {
		expect(hasAnyElementAtRowPosition(elements, 2, () => null)).toBe(true);
	});
});

describe("withAutoFocus", () => {
	it("sets autoFocus only for the first richtext prop", () => {
		const map = withAutoFocus();

		const [, firstResult] = map({ type: "richtext" } as never);
		const [, secondResult] = map({ type: "richtext" } as never);
		const [, thirdResult] = map({ type: "text" } as never);

		expect(firstResult.autoFocus).toBe(true);
		expect(secondResult.autoFocus).toBe(false);
		expect(thirdResult.autoFocus).toBe(false);
	});
});

describe("getElementFromList", () => {
	const elements = [{ id: "a" }, { id: "b" }] as unknown as WebBuilderElement[];

	it("returns null when no selectedElementId", () => {
		expect(getElementFromList(undefined, elements)).toBeNull();
	});

	it("returns the matching element", () => {
		expect(getElementFromList("b", elements)).toEqual(elements[1]);
	});
});

describe("getElementContainerIdProp", () => {
	it("returns the containerId prop", () => {
		const props = [
			{ propId: "containerId", value: "container-1" },
			{ propId: "other", value: "x" },
		] as WebBuilderElementProperty[];

		expect(getElementContainerIdProp(props)).toEqual(props[0]);
	});

	it("returns undefined when not found", () => {
		expect(getElementContainerIdProp([])).toBeUndefined();
	});
});

describe("sortElements", () => {
	it("sorts elements by y then x", () => {
		const elements = [
			{ id: "1", x: 5, y: 1 },
			{ id: "2", x: 1, y: 0 },
			{ id: "3", x: 0, y: 1 },
		] as unknown as WebBuilderElement[];

		expect(sortElements(elements).map((e) => e.id)).toEqual(["2", "3", "1"]);
	});
});
