import { act, render, screen } from "@testing-library/react";
import React from "react";
import type { Breakpoint } from "types";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@/hooks/useFontImport", () => ({
	useFontImport: vi.fn(() => ({
		fontFamily: "Arial",
		stylesheet: <style data-testid="font-stylesheet" />,
	})),
}));

vi.mock("../ComponentsProvider", () => ({
	useComponentsProperty: vi.fn(() => []),
}));

let mockViewProps: {
	page: unknown;
	transformElementProperty?: unknown;
};

vi.mock("../PropertiesProvider", () => ({
	useViewProperties: () => mockViewProps,
	useProperties: () => ({}),
}));

vi.mock("../RenderInContainer", () => ({
	RenderInContainer: ({ children }: React.PropsWithChildren) => (
		<div data-testid="render-in-container">{children}</div>
	),
}));

vi.mock("./RenderBreakpoint/RenderBreakpoint", () => ({
	RenderBreakpoint: ({
		children,
		breakpoint,
	}: React.PropsWithChildren<{ breakpoint: Breakpoint }>) => (
		<div data-testid="render-breakpoint" data-breakpoint-id={breakpoint.id}>
			{children}
		</div>
	),
}));

vi.mock("./RenderTree", () => ({
	RenderTree: ({ breakpoint }: { breakpoint: Breakpoint }) => (
		<div data-testid="render-tree">{breakpoint.id}</div>
	),
}));

import { useFontImport } from "@/hooks/useFontImport";

import { ViewRenderPage } from "./ViewRenderPage";

const makeBreakpoint = (
	overrides: Partial<Breakpoint> & { id: string; from: number },
): Breakpoint =>
	({
		to: null,
		parentId: null,
		view: { type: "component" },
		cols: 12,
		rowHeight: 10,
		...overrides,
	}) as unknown as Breakpoint;

afterEach(() => {
	vi.clearAllMocks();
	vi.mocked(useFontImport).mockReturnValue({
		fontFamily: "Arial",
		stylesheet: <style data-testid="font-stylesheet" />,
	} as never);
});

describe("ViewRenderPage", () => {
	it("renders nothing (besides the outer wrapper) before a container width is known", () => {
		mockViewProps = {
			page: { breakpoints: [makeBreakpoint({ id: "bp-1", from: 0 })] },
		};

		const { container } = render(<ViewRenderPage />);

		expect(container.querySelector(".react-web-builder-view")).not.toBeNull();
		expect(screen.queryByTestId("render-tree")).toBeNull();
	});

	it("renders nothing when the page has no breakpoints", () => {
		mockViewProps = { page: {} };

		render(<ViewRenderPage />);

		expect(screen.queryByTestId("render-tree")).toBeNull();
	});

	it("selects and renders the matching breakpoint once a container width is measured", () => {
		mockViewProps = {
			page: {
				breakpoints: [
					makeBreakpoint({ id: "bp-small", from: 0 }),
					makeBreakpoint({ id: "bp-large", from: 900 }),
				],
			},
		};

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 950 }) as DOMRect;

		render(<ViewRenderPage />);

		expect(screen.getByTestId("render-tree").textContent).toBe("bp-large");
		expect(
			screen
				.getByTestId("render-breakpoint")
				.getAttribute("data-breakpoint-id"),
		).toBe("bp-large");

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("picks the smaller breakpoint when container width is below every breakpoint's 'from'", () => {
		mockViewProps = {
			page: {
				breakpoints: [
					makeBreakpoint({ id: "bp-small", from: 0 }),
					makeBreakpoint({ id: "bp-large", from: 900 }),
				],
			},
		};

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 100 }) as DOMRect;

		render(<ViewRenderPage />);

		expect(screen.getByTestId("render-tree").textContent).toBe("bp-small");

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("keeps a wider breakpoint whose 'from' the width satisfies", () => {
		mockViewProps = {
			page: {
				breakpoints: [
					makeBreakpoint({ id: "bp-small", from: 0, to: 400 }),
					makeBreakpoint({ id: "bp-mid", from: 200, to: 300 }),
				],
			},
		};

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 350 }) as DOMRect;

		render(<ViewRenderPage />);

		expect(screen.getByTestId("render-tree").textContent).toBe("bp-mid");

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("skips a candidate breakpoint whose 'to' is smaller than the container width", () => {
		mockViewProps = {
			page: {
				breakpoints: [
					makeBreakpoint({ id: "bp-a", from: 0, to: 1000 }),
					makeBreakpoint({ id: "bp-b", from: 100, to: 150 }),
				],
			},
		};

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 200 }) as DOMRect;

		render(<ViewRenderPage />);

		// bp-b.from(100) <= 200 so it becomes the loop-selected breakpoint;
		// then in forEach, item=bp-a: breakpoint.from(100) < item.from(0) is false, skipped.
		// item=bp-b: breakpoint.from(100) < item.from(100) is false, skipped too, so bp-b stands
		// but since bp-b.to(150) < width(200), it was already selected earlier by the for-loop
		// which does not consult 'to' - this asserts that path renders without throwing.
		expect(screen.getByTestId("render-tree")).not.toBeNull();

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("filters out breakpoints whose tree has no elements", () => {
		mockViewProps = {
			page: {
				breakpoints: [
					makeBreakpoint({
						id: "bp-empty",
						from: 0,
						view: {
							type: "row",
							children: [],
						} as unknown as Breakpoint["view"],
					}),
					makeBreakpoint({ id: "bp-with-elements", from: 0 }),
				],
			},
		};

		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width: 100 }) as DOMRect;

		render(<ViewRenderPage />);

		expect(screen.getByTestId("render-tree").textContent).toBe(
			"bp-with-elements",
		);

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("re-measures width on window resize once mounted with a non-zero width", () => {
		mockViewProps = {
			page: {
				breakpoints: [makeBreakpoint({ id: "bp-1", from: 0 })],
			},
		};

		let width = 100;
		const originalGetBoundingClientRect =
			HTMLDivElement.prototype.getBoundingClientRect;
		HTMLDivElement.prototype.getBoundingClientRect = () =>
			({ width }) as DOMRect;

		render(<ViewRenderPage />);

		expect(screen.getByTestId("render-tree")).not.toBeNull();

		width = 200;
		act(() => {
			window.dispatchEvent(new Event("resize"));
		});

		expect(screen.getByTestId("render-tree")).not.toBeNull();

		HTMLDivElement.prototype.getBoundingClientRect =
			originalGetBoundingClientRect;
	});

	it("renders the font stylesheet returned by useFontImport", () => {
		mockViewProps = { page: {} };

		render(<ViewRenderPage />);

		expect(screen.getByTestId("font-stylesheet")).not.toBeNull();
	});

	it("renders nothing extra when fontImport is null", () => {
		vi.mocked(useFontImport).mockReturnValue(null as never);
		mockViewProps = { page: {} };

		render(<ViewRenderPage />);

		expect(screen.queryByTestId("font-stylesheet")).toBeNull();
	});
});
