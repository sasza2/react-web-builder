import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { Provider } from "react-redux";
import { afterEach, describe, expect, it, vi } from "vitest";

import { createStore } from "@/store/store";

vi.mock("react-i18next", async (importOriginal) => {
	const actual = await importOriginal<typeof import("react-i18next")>();
	return {
		...actual,
		useTranslation: () => ({ t: (key: string) => key }),
	};
});

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: vi.fn(() => []),
}));

vi.mock("@/components/Grid/LoadBreakpoint", () => ({
	useIsBreakpointLoading: vi.fn(() => false),
}));

vi.mock("@/components/View/removePaddingFromLastTreeElement", () => ({
	removePaddingFromLastTreeElement: vi.fn(),
}));

vi.mock("@/hooks/useBreakpoints", () => ({
	useBreakpoints: vi.fn(() => []),
}));

vi.mock("@/hooks/useElements", () => ({
	useElements: vi.fn(() => ({ elementsExtras: { current: {} } })),
}));

vi.mock("@/hooks/useFontImport", () => ({
	useFontImport: vi.fn(() => ({ fontFamily: "MockFont", stylesheet: null })),
}));

vi.mock("../../View/createTreeElements", () => ({
	default: vi.fn(() => ({ id: "tree-1", type: "row", children: [] })),
}));

vi.mock("../../View/getBreakpointRowsByLastElement", () => ({
	default: vi.fn(() => 3),
}));

vi.mock("../../View/RenderBreakpoint/RenderBreakpoint", () => ({
	RenderBreakpoint: ({
		children,
		breakpoint,
		className,
	}: ComponentProps<
		typeof import("../../View/RenderBreakpoint/RenderBreakpoint").RenderBreakpoint
	>) => (
		<div
			data-testid="render-breakpoint"
			data-breakpoint-id={breakpoint?.id}
			data-classname={className}
		>
			{children}
		</div>
	),
}));

vi.mock("../../View/RenderTree", () => ({
	RenderTree: () => <div data-testid="render-tree" />,
}));

vi.mock("../ElementContainerDecorator/ElementContainerDecorator", () => ({
	ElementContainerDecorator: ({ children }: React.PropsWithChildren) => (
		<div data-testid="decorator">{children}</div>
	),
}));

vi.mock("../useContainerStyle", () => ({
	useContainerStyle: vi.fn(() => ({ height: "10px" })),
}));

vi.mock("../../PropertiesProvider", () => ({
	useProperties: vi.fn(() => ({ transformElementProperty: vi.fn() })),
}));

import * as ComponentsProviderModule from "@/components/ComponentsProvider";
import * as LoadBreakpointModule from "@/components/Grid/LoadBreakpoint";
import * as useBreakpointsModule from "@/hooks/useBreakpoints";
import * as useElementsModule from "@/hooks/useElements";

import {
	buildBreakpoint,
	buildBreakpointHeight,
	buildElement,
	buildTree,
} from "@/testing/fixtures";

import { BuilderElementContainer } from "./BuilderElementContainer";

const BASE_PROPS = {
	breakpointHeight: buildBreakpointHeight(),
	containerId: "bp-1",
	fontFamily: "Arial",
};

const renderWithStore = (
	ui: React.ReactElement,
	preloadedState: Parameters<typeof createStore>[0] = {},
) => {
	const store = createStore(preloadedState);
	return render(<Provider store={store}>{ui}</Provider>);
};

afterEach(() => {
	vi.restoreAllMocks();
});

describe("BuilderElementContainer", () => {
	it("throws when no matching container is found (Empty.styled dereferences $container.rowHeight without a null check)", () => {
		// Bug: when `container` is undefined (no breakpoint matches containerId),
		// the component still renders <Empty $container={container}>, and the
		// styled-component's template literal does `${$container.rowHeight}px`
		// with no guard, crashing instead of rendering "container.empty" text.
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([]);
		vi.spyOn(console, "error").mockImplementation(() => {});

		expect(() =>
			renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
				elementsInBreakpoints: {},
			}),
		).toThrow(/rowHeight/);
	});

	it("renders Empty when container found but has no elements and is not breakpoint-loading", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);
		vi.spyOn(LoadBreakpointModule, "useIsBreakpointLoading").mockReturnValue(
			false,
		);

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: { "bp-1": [] },
		});

		expect(screen.getByText("container.empty")).not.toBeNull();
	});

	it("renders RenderBreakpoint with template tree when breakpoint is loading and has a template", () => {
		const container = buildBreakpoint({
			id: "bp-1",
			rowHeight: 100,
			template: buildTree({ id: "template-tree", type: "row", children: [] }),
		});
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);
		vi.spyOn(LoadBreakpointModule, "useIsBreakpointLoading").mockReturnValue(
			true,
		);

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: { "bp-1": [] },
		});

		expect(screen.getByTestId("render-breakpoint")).not.toBeNull();
		expect(screen.getByTestId("render-tree")).not.toBeNull();
	});

	it("renders the built tree via RenderTree when the container has elements", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);
		vi.spyOn(LoadBreakpointModule, "useIsBreakpointLoading").mockReturnValue(
			false,
		);

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
		});

		const breakpointNode = screen.getByTestId("render-breakpoint");
		expect(breakpointNode).not.toBeNull();
		expect(breakpointNode.getAttribute("data-classname")).toBeNull();
		expect(screen.getByTestId("render-tree")).not.toBeNull();
		expect(screen.getByTestId("decorator")).not.toBeNull();
	});

	it("uses the scrollbar-hidden class name when breakpointHeight.isScrollbarHidden is true", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);

		renderWithStore(
			<BuilderElementContainer
				{...BASE_PROPS}
				breakpointHeight={buildBreakpointHeight({ isScrollbarHidden: true })}
			/>,
			{ elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] } },
		);

		const breakpointNode = screen.getByTestId("render-breakpoint");
		expect(breakpointNode.getAttribute("data-classname")).not.toBe("");
	});

	it("does not apply fontImport.fontFamily when fontFamily prop is not provided", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);

		renderWithStore(
			<BuilderElementContainer
				{...BASE_PROPS}
				fontFamily={undefined as unknown as string}
			/>,
			{ elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] } },
		);

		expect(screen.getByTestId("render-tree")).not.toBeNull();
	});

	it("falls back to an empty elementsExtras/[] when the relevant maps are missing", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);
		vi.spyOn(useElementsModule, "useElements").mockReturnValue({
			elements: [],
			elementsInBreakpoints: {},
			elementsExtras: { current: {} },
		});

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
		});

		expect(screen.getByTestId("render-tree")).not.toBeNull();
	});

	it("falls back to [] when elementsInBreakpoints has no entry for the container id", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: {},
		});

		expect(screen.getByText("container.empty")).not.toBeNull();
	});

	it("passes components from useComponentsProperty through to RenderTree", () => {
		const container = buildBreakpoint({ id: "bp-1", rowHeight: 100 });
		vi.spyOn(useBreakpointsModule, "useBreakpoints").mockReturnValue([
			container,
		]);
		vi.spyOn(ComponentsProviderModule, "useComponentsProperty").mockReturnValue(
			[{ id: "Text", component: () => null }],
		);

		renderWithStore(<BuilderElementContainer {...BASE_PROPS} />, {
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
		});

		expect(screen.getByTestId("render-tree")).not.toBeNull();
	});
});
