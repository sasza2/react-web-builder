import type {
	Breakpoint,
	BreakpointsExtras,
	Page,
	PageSettings,
	WebBuilderComponent,
	WebBuilderElement,
} from "types";
import { describe, expect, it, vi } from "vitest";

import {
	assignAllToElementsExtras,
	assignToElementsExtras,
	byBreakpointId,
	createTreeFromBreakpoint,
	getBreakpointBackgroundColor,
	getBreakpointPadding,
	initElementsExtrasFromBreakpoint,
	isBreakpoint,
	isContainerBreakpoint,
	shouldLoadTemplate,
	shouldLoadTemplateForBreakpoint,
} from "./breakpoint";

describe("getBreakpointBackgroundColor", () => {
	it("returns breakpoint color when set", () => {
		expect(
			getBreakpointBackgroundColor(
				{ backgroundColor: "#111" } as Breakpoint,
				{ backgroundColor: "#fff" } as PageSettings,
			),
		).toBe("#111");
	});

	it("falls back to page settings color", () => {
		expect(
			getBreakpointBackgroundColor(
				{ backgroundColor: null } as Breakpoint,
				{ backgroundColor: "#fff" } as PageSettings,
			),
		).toBe("#fff");
	});
});

describe("getBreakpointPadding", () => {
	it("returns zeros when no padding", () => {
		expect(getBreakpointPadding({} as Breakpoint)).toEqual({
			top: 0,
			right: 0,
			bottom: 0,
			left: 0,
		});
	});

	it("returns padding values defaulting missing ones to 0", () => {
		expect(
			getBreakpointPadding({
				padding: { top: 5, right: undefined, bottom: 3, left: undefined },
			} as unknown as Breakpoint),
		).toEqual({ top: 5, right: 0, bottom: 3, left: 0 });
	});
});

describe("isBreakpoint / isContainerBreakpoint", () => {
	it("returns true for root breakpoints", () => {
		expect(isBreakpoint({} as Breakpoint)).toBe(true);
		expect(isContainerBreakpoint({} as Breakpoint)).toBe(false);
	});

	it("returns false for nested containers", () => {
		expect(isBreakpoint({ parentId: "a" } as Breakpoint)).toBe(false);
		expect(isContainerBreakpoint({ parentId: "a" } as Breakpoint)).toBe(true);
	});
});

describe("shouldLoadTemplateForBreakpoint", () => {
	it("returns false without a page", () => {
		expect(
			shouldLoadTemplateForBreakpoint(
				undefined as unknown as Page,
				{} as Breakpoint,
			),
		).toBe(false);
	});

	it("returns false when breakpoint has no template", () => {
		expect(shouldLoadTemplateForBreakpoint({} as Page, {} as Breakpoint)).toBe(
			false,
		);
	});

	it("returns true when there are no elements extras yet", () => {
		const page = { elementsExtras: {} } as unknown as Page;
		const breakpoint = { id: "bp-1", template: "t" } as unknown as Breakpoint;

		expect(shouldLoadTemplateForBreakpoint(page, breakpoint)).toBe(true);
	});

	it("returns false when elements extras already exist", () => {
		const page = {
			elementsExtras: { "bp-1": { "el-1": {} } },
		} as unknown as Page;
		const breakpoint = { id: "bp-1", template: "t" } as unknown as Breakpoint;

		expect(shouldLoadTemplateForBreakpoint(page, breakpoint)).toBe(false);
	});
});

describe("shouldLoadTemplate", () => {
	it("returns false without a page or breakpoints array", () => {
		expect(shouldLoadTemplate(undefined as unknown as Page)).toBe(false);
		expect(shouldLoadTemplate({} as Page)).toBe(false);
	});

	it("returns true when any breakpoint should load a template", () => {
		const page = {
			elementsExtras: {},
			breakpoints: [{ id: "bp-1", template: "t" }],
		} as unknown as Page;

		expect(shouldLoadTemplate(page)).toBe(true);
	});
});

describe("assignToElementsExtras", () => {
	it("creates a new entry when missing", () => {
		const elementsExtras = {
			current: { "bp-1": {} },
		} as unknown as React.MutableRefObject<BreakpointsExtras>;

		assignToElementsExtras(
			elementsExtras,
			{ id: "bp-1" } as Breakpoint,
			{ "el-1": 100 },
			"height",
		);

		expect(elementsExtras.current["bp-1"]["el-1"]).toEqual({ height: 100 });
	});

	it("updates an existing entry", () => {
		const elementsExtras = {
			current: { "bp-1": { "el-1": { height: 1 } } },
		} as unknown as React.MutableRefObject<BreakpointsExtras>;

		assignToElementsExtras(
			elementsExtras,
			{ id: "bp-1" } as Breakpoint,
			{ "el-1": 200 },
			"height",
		);

		expect(elementsExtras.current["bp-1"]["el-1"]).toEqual({ height: 200 });
	});
});

describe("assignAllToElementsExtras", () => {
	it("does nothing when gridAPI is not ready", () => {
		const elementsExtras = {
			current: {},
		} as unknown as React.MutableRefObject<BreakpointsExtras>;
		const gridAPI = {
			current: null,
		} as unknown as React.MutableRefObject<never>;

		expect(() =>
			assignAllToElementsExtras(elementsExtras, {} as Breakpoint, gridAPI),
		).not.toThrow();
	});

	it("assigns height and paddingBottom from gridAPI", () => {
		const elementsExtras = {
			current: { "bp-1": {} },
		} as unknown as React.MutableRefObject<BreakpointsExtras>;
		const gridAPI = {
			current: {
				measureElementsHeight: vi.fn().mockReturnValue({ "el-1": 10 }),
				getElementsPaddingBottom: vi.fn().mockReturnValue({ "el-1": 2 }),
			},
		} as unknown as React.MutableRefObject<never>;

		assignAllToElementsExtras(
			elementsExtras,
			{ id: "bp-1" } as Breakpoint,
			gridAPI,
		);

		expect(elementsExtras.current["bp-1"]["el-1"]).toEqual({
			height: 10,
			paddingBottom: 2,
		});
	});
});

describe("initElementsExtrasFromBreakpoint", () => {
	it("initializes extras from page data", () => {
		const elementsExtras = {
			current: {},
		} as unknown as React.MutableRefObject<Record<string, unknown>>;
		const page = {
			elementsExtras: { "bp-1": { "el-1": { height: 5 } } },
		} as unknown as Page;

		initElementsExtrasFromBreakpoint(
			page,
			{ id: "bp-1" } as Breakpoint,
			elementsExtras as never,
		);

		expect(elementsExtras.current["bp-1"]).toEqual({ "el-1": { height: 5 } });
	});

	it("does not overwrite an existing entry", () => {
		const elementsExtras = {
			current: { "bp-1": { existing: true } },
		} as unknown as React.MutableRefObject<Record<string, unknown>>;

		initElementsExtrasFromBreakpoint(
			{} as Page,
			{ id: "bp-1" } as Breakpoint,
			elementsExtras as never,
		);

		expect(elementsExtras.current["bp-1"]).toEqual({ existing: true });
	});

	it("does nothing without a breakpoint", () => {
		const elementsExtras = {
			current: {},
		} as unknown as React.MutableRefObject<Record<string, unknown>>;

		initElementsExtrasFromBreakpoint(
			{} as Page,
			undefined as unknown as Breakpoint,
			elementsExtras as never,
		);

		expect(elementsExtras.current).toEqual({});
	});
});

describe("byBreakpointId", () => {
	it("matches a breakpoint with the given id", () => {
		expect(byBreakpointId("bp-1")({ id: "bp-1" } as Breakpoint)).toBe(true);
		expect(byBreakpointId("bp-1")({ id: "bp-2" } as Breakpoint)).toBe(false);
	});
});

describe("createTreeFromBreakpoint", () => {
	const components = [
		{ id: "Text", isContainer: false },
		{ id: "Container", isContainer: true },
	] as unknown as WebBuilderComponent[];

	it("builds a tree entry for a non-container element", () => {
		const element = {
			id: "el-1",
			componentName: "Text",
			props: [],
		} as unknown as WebBuilderElement;

		const result = createTreeFromBreakpoint({
			allBreakpoints: [],
			components,
			elementsInBreakpoints: {},
			selectedElements: [element],
			currentBreakpoint: { id: "bp-1" } as Breakpoint,
			elementsExtras: {},
			rewriteContainersIds: false,
		});

		expect(result).toHaveLength(1);
		expect(result[0].element.breakpointId).toBe("bp-1");
		expect(result[0].container).toBeUndefined();
	});

	it("pushes only element when container not found", () => {
		const element = {
			id: "el-1",
			componentName: "Container",
			props: [{ propId: "containerId", value: "missing" }],
		} as unknown as WebBuilderElement;

		const result = createTreeFromBreakpoint({
			allBreakpoints: [],
			components,
			elementsInBreakpoints: {},
			selectedElements: [element],
			currentBreakpoint: { id: "bp-1" } as Breakpoint,
			elementsExtras: {},
			rewriteContainersIds: false,
		});

		expect(result).toHaveLength(1);
		expect(result[0].container).toBeUndefined();
	});

	it("builds a nested tree for a container element without rewriting ids", () => {
		const childElement = {
			id: "child-1",
			componentName: "Text",
			props: [],
		} as unknown as WebBuilderElement;
		const containerElement = {
			id: "el-1",
			componentName: "Container",
			props: [{ propId: "containerId", value: "container-1" }],
		} as unknown as WebBuilderElement;
		const container = { id: "container-1" } as Breakpoint;

		const result = createTreeFromBreakpoint({
			allBreakpoints: [container],
			components,
			elementsInBreakpoints: { "container-1": [childElement] },
			selectedElements: [containerElement],
			currentBreakpoint: { id: "bp-1" } as Breakpoint,
			elementsExtras: {},
			rewriteContainersIds: false,
		});

		expect(result[0].container).toEqual(container);
		expect(result[0].children).toHaveLength(1);
		expect(result[0].element.breakpointId).toBe("container-1");
	});

	it("rewrites container ids when requested", () => {
		const childElement = {
			id: "child-1",
			componentName: "Text",
			props: [],
		} as unknown as WebBuilderElement;
		const containerElement = {
			id: "el-1",
			componentName: "Container",
			props: [{ propId: "containerId", value: "container-1" }],
		} as unknown as WebBuilderElement;
		const container = { id: "container-1" } as Breakpoint;
		const elementsExtras = { "container-1": { some: "extra" } };

		const result = createTreeFromBreakpoint({
			allBreakpoints: [container],
			components,
			elementsInBreakpoints: { "container-1": [childElement] },
			selectedElements: [containerElement],
			currentBreakpoint: { id: "bp-1" } as Breakpoint,
			elementsExtras,
			rewriteContainersIds: true,
		});

		const newContainerId = result[0].container.id;
		expect(newContainerId).not.toBe("container-1");
		expect(result[0].container.parentId).toBe("bp-1");
		expect(elementsExtras[newContainerId]).toEqual({ some: "extra" });
	});
});
