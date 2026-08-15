import type { API as PanZoomAPI } from "@sasza/react-panzoom";
import type { GridAPI } from "react-grid-panzoom";
import type {
	Breakpoint,
	BreakpointHeight,
	Configuration,
	Page,
	Tree,
	WebBuilderElement,
} from "types";
import { vi } from "vitest";

/**
 * Typed factories for the domain objects used across unit tests. They return
 * fully valid objects, so tests can override only the fields they care about
 * without losing type checking.
 */

export const buildBreakpoint = (
	breakpoint: Partial<Breakpoint> = {},
): Breakpoint => ({
	id: "bp-1",
	from: 0,
	to: null,
	rowHeight: 10,
	cols: 12,
	padding: {
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	...breakpoint,
});

export const buildElement = (
	element: Partial<WebBuilderElement> = {},
): WebBuilderElement => ({
	id: "el-1",
	componentName: "box",
	x: 0,
	y: 0,
	w: 1,
	h: 1,
	props: [],
	...element,
});

export const buildTree = (tree: Partial<Tree> = {}): Tree => ({
	id: "tree-1",
	type: "row",
	w: 12,
	h: 1,
	marginLeft: 0,
	marginRight: 0,
	marginTop: 0,
	marginBottom: 0,
	...tree,
});

export const buildPage = (page: Partial<Page> = {}): Page => ({
	breakpoints: [],
	elementsInBreakpoints: {},
	elementsExtras: {},
	...page,
});

export const buildPanZoomAPI = (
	panZoom: Partial<PanZoomAPI> = {},
): PanZoomAPI => ({
	childNode: document.createElement("div"),
	move: vi.fn(),
	getElements: vi.fn(() => ({})),
	getElementsInMove: vi.fn(() => ({})),
	grabElement: vi.fn(() => null),
	goBackToBoundary: vi.fn(),
	updateElementPosition: vi.fn(),
	updateElementPositionSilent: vi.fn(),
	getPosition: vi.fn(() => ({ x: 0, y: 0 })),
	setPosition: vi.fn(),
	getZoom: vi.fn(() => 1),
	setZoom: vi.fn(),
	zoomIn: vi.fn(),
	zoomOut: vi.fn(),
	reset: vi.fn(),
	...panZoom,
});

export const buildGridAPI = (gridAPI: Partial<GridAPI> = {}): GridAPI => ({
	calculateCellPositionByPixels: vi.fn(() => ({ x: 0, y: 0 })),
	getLowestElementBottomInPixels: vi.fn(() => 0),
	getPanZoom: vi.fn(() => buildPanZoomAPI()),
	grabElement: vi.fn(),
	measureElementHeight: vi.fn(() => null),
	measureElementsHeight: vi.fn(() => ({})),
	getElementsPaddingBottom: vi.fn(() => ({})),
	organizeElements: vi.fn(() => []),
	...gridAPI,
});

export const buildConfiguration = (
	configuration: Partial<Configuration> = {},
): Configuration => ({
	autoFocusRichTextInEditProperties: true,
	autoSave: false,
	bringElementsAbove: true,
	gridZoomingInCenter: false,
	helpLines: true,
	panZoomScroll: false,
	builderHintsId: 0,
	scrollSpeed: 3,
	editOnDoubleClick: false,
	preventCloseEditOnClick: false,
	...configuration,
});

export const buildDOMRect = (rect: Partial<DOMRect> = {}): DOMRect => {
	const { x = 0, y = 0, width = 0, height = 0, ...rest } = rect;

	const domRect = {
		x,
		y,
		width,
		height,
		top: y,
		left: x,
		right: x + width,
		bottom: y + height,
		...rest,
	};

	return { ...domRect, toJSON: () => domRect };
};

export const buildBreakpointHeight = (
	breakpointHeight: Partial<BreakpointHeight> = {},
): BreakpointHeight => ({
	enabled: false,
	overflow: "visible",
	...breakpointHeight,
});
