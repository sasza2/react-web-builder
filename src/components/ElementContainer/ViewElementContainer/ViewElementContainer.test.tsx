import { render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import type { Page } from "types";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: vi.fn(() => []),
}));

vi.mock("@/components/PropertiesProvider", () => ({
	useViewProperties: vi.fn(),
}));

vi.mock("@/components/View/createTreeElements", () => ({
	default: vi.fn(() => ({ id: "tree-1", type: "row", children: [] })),
}));

vi.mock("@/components/View/getBreakpointRowsByLastElement", () => ({
	default: vi.fn(() => 2),
}));

vi.mock("@/components/View/RenderBreakpoint/RenderBreakpoint", () => ({
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

vi.mock("@/components/View/RenderTree", () => ({
	RenderTree: () => <div data-testid="render-tree" />,
}));

vi.mock("@/hooks/useFontImport", () => ({
	useFontImport: vi.fn(() => ({
		fontFamily: "MockFont",
		stylesheet: <style data-testid="font-stylesheet" />,
	})),
}));

vi.mock("../ElementContainerDecorator/ElementContainerDecorator", () => ({
	ElementContainerDecorator: ({ children }: React.PropsWithChildren) => (
		<div data-testid="decorator">{children}</div>
	),
}));

vi.mock("../useContainerStyle", () => ({
	useContainerStyle: vi.fn(() => ({ height: "10px" })),
}));

import * as PropertiesProviderModule from "@/components/PropertiesProvider";

import {
	buildBreakpoint,
	buildBreakpointHeight,
	buildElement,
} from "@/testing/fixtures";

import { ViewElementContainer } from "./ViewElementContainer";

afterEach(() => {
	vi.restoreAllMocks();
});

const BASE_PROPS = {
	breakpointHeight: buildBreakpointHeight(),
	containerId: "bp-1",
};

const mockViewProperties = (page: Page) => {
	vi.spyOn(PropertiesProviderModule, "useViewProperties").mockReturnValue({
		page,
		transformElementProperty: vi.fn(),
	});
};

describe("ViewElementContainer", () => {
	it("renders nothing when no matching container is found", () => {
		mockViewProperties({
			breakpoints: [],
			elementsInBreakpoints: {},
			elementsExtras: {},
		});

		const { container } = render(<ViewElementContainer {...BASE_PROPS} />);

		expect(container.firstChild).toBeNull();
	});

	it("renders nothing when container found but has no elements", () => {
		const bp = buildBreakpoint({ id: "bp-1", rowHeight: 50 });
		mockViewProperties({
			breakpoints: [bp],
			elementsInBreakpoints: { "bp-1": [] },
			elementsExtras: {},
		});

		const { container } = render(<ViewElementContainer {...BASE_PROPS} />);

		expect(container.firstChild).toBeNull();
	});

	it("renders the built tree via RenderTree when the container has elements", () => {
		const bp = buildBreakpoint({ id: "bp-1", rowHeight: 50 });
		mockViewProperties({
			breakpoints: [bp],
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
			elementsExtras: { "bp-1": {} },
		});

		render(<ViewElementContainer {...BASE_PROPS} fontFamily="Arial" />);

		expect(screen.getByTestId("render-breakpoint")).not.toBeNull();
		expect(screen.getByTestId("render-tree")).not.toBeNull();
		expect(screen.getByTestId("decorator")).not.toBeNull();
		expect(screen.getByTestId("font-stylesheet")).not.toBeNull();
	});

	it("uses the scrollbar-hidden class name when breakpointHeight.isScrollbarHidden is true", () => {
		const bp = buildBreakpoint({ id: "bp-1", rowHeight: 50 });
		mockViewProperties({
			breakpoints: [bp],
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
			elementsExtras: {},
		});

		render(
			<ViewElementContainer
				{...BASE_PROPS}
				breakpointHeight={buildBreakpointHeight({ isScrollbarHidden: true })}
			/>,
		);

		const node = screen.getByTestId("render-breakpoint");
		expect(node.getAttribute("data-classname")).not.toBe("");
	});

	it("does not render fontImport.stylesheet when fontFamily is not provided", () => {
		const bp = buildBreakpoint({ id: "bp-1", rowHeight: 50 });
		mockViewProperties({
			breakpoints: [bp],
			elementsInBreakpoints: { "bp-1": [buildElement({ id: "el-1" })] },
			elementsExtras: {},
		});

		render(<ViewElementContainer {...BASE_PROPS} fontFamily={undefined} />);

		expect(screen.queryByTestId("font-stylesheet")).toBeNull();
	});

	it("falls back to an empty elementsInBreakpoints/elementsExtras map when missing", () => {
		const bp = buildBreakpoint({ id: "bp-1", rowHeight: 50 });
		mockViewProperties({
			breakpoints: [bp],
			elementsInBreakpoints: {},
			elementsExtras: {},
		});

		const { container } = render(<ViewElementContainer {...BASE_PROPS} />);

		expect(container.firstChild).toBeNull();
	});
});
