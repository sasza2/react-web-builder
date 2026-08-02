import { act, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import type PanZoom from "@sasza/react-panzoom";
import type { API as PanZoomAPI } from "@sasza/react-panzoom";
import type { WebBuilderComponent, WebBuilderElementProperty } from "types";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";
import {
	buildBreakpoint,
	buildDOMRect,
	buildGridAPI,
	buildPanZoomAPI,
} from "@/testing/fixtures";

type PanZoomProps = ComponentProps<typeof PanZoom>;

let latestPanZoomProps: PanZoomProps;
let latestPanZoomRef: React.MutableRefObject<PanZoomAPI>;

vi.mock("@sasza/react-panzoom", () => ({
	__esModule: true,
	default: React.forwardRef<PanZoomAPI, PanZoomProps>((props, ref) => {
		latestPanZoomProps = props;
		latestPanZoomRef = ref as React.MutableRefObject<PanZoomAPI>;
		React.useImperativeHandle(ref, () => buildPanZoomAPI());
		return <div data-testid="panzoom">{props.children}</div>;
	}),
	Element: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
}));

vi.mock("@/hooks/container/useAddBreakpointForContainer", () => ({
	useAddBreakpointForContainer: () => vi.fn(() => "container-bp-id"),
}));

vi.mock("@/hooks/useGridPositionTop", () => ({
	useGridPositionTop: () => 20,
}));

vi.mock("../SidebarProvider", () => ({
	useSidebarWidth: () => 100,
}));

const gridAPICurrent = buildGridAPI();
vi.mock("../GridAPIProvider/GridAPIProvider", () => ({
	useGridAPI: () => ({ current: gridAPICurrent }),
}));

const addElementMock = vi.fn();
vi.mock("@/hooks/useAddElement", () => ({
	useAddElement: () => addElementMock,
}));

import { DragElement, type DragElementDetails } from "./DragElement";

const COMPONENT: WebBuilderComponent = {
	id: "Text",
	isContainer: false,
	props: [],
	component: () => null,
};

const BASE_DETAILS: DragElementDetails = {
	position: { x: 0, y: 0 },
	component: COMPONENT,
	offset: { x: 5, y: 5 },
	width: 100,
};

function makeStore() {
	return createStore({
		breakpoints: [buildBreakpoint({ id: "bp-1", rowHeight: 10 })],
		selectedBreakpoint: "bp-1",
	});
}

function renderDragElement(
	props: Partial<React.ComponentProps<typeof DragElement>> = {},
	store = makeStore(),
) {
	const onCancel = vi.fn();
	const onSuccess = vi.fn();

	const utils = render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<DragElement
					{...BASE_DETAILS}
					onCancel={onCancel}
					onSuccess={onSuccess}
					{...props}
				>
					<span>drag-child</span>
				</DragElement>
			</ThemeProvider>
		</Provider>,
	);

	return { ...utils, onCancel, onSuccess, store };
}

describe("DragElement", () => {
	let childRect: DOMRect;
	let containerRect: DOMRect;

	beforeEach(() => {
		vi.useFakeTimers();
		addElementMock.mockClear();

		childRect = buildDOMRect({ left: 0, right: 200, bottom: 200 });
		containerRect = buildDOMRect({ left: 0, right: 500, bottom: 500 });

		const container = document.createElement("div");
		const childNode = document.createElement("div");
		container.appendChild(childNode);
		childNode.getBoundingClientRect = () => childRect;
		container.getBoundingClientRect = () => containerRect;

		gridAPICurrent.getPanZoom = () => buildPanZoomAPI({ childNode });
		gridAPICurrent.calculateCellPositionByPixels = (x: number, y: number) => ({
			x,
			y,
		});
		gridAPICurrent.grabElement = vi.fn();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	it("renders children through a portal into document.body", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		expect(
			document.body.querySelector("[data-testid='panzoom']"),
		).not.toBeNull();
		expect(document.body.textContent).toContain("drag-child");
	});

	it("grabs the dragged component and marks loaded once the panZoomRef is ready", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		expect(latestPanZoomRef.current.grabElement).toBeDefined();
	});

	it("cancels on mouseup and calls onCancel", () => {
		const { onCancel } = renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			window.dispatchEvent(new MouseEvent("mouseup"));
		});

		expect(onCancel).toHaveBeenCalled();
	});

	it("adds the element when the dragged position lands on the grid area, then grabs it after the timeout", () => {
		const { onSuccess } = renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({ component: { x: 50, y: 50 } });
		});

		expect(addElementMock).toHaveBeenCalledTimes(1);
		expect(onSuccess).toHaveBeenCalledTimes(1);
		expect(
			document.body.classList.contains(
				"react-web-builder-prevent-elements-transition",
			),
		).toBe(true);

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(gridAPICurrent.grabElement).toHaveBeenCalledTimes(1);
	});

	it("adds a breakpoint id to props when the component is a container", () => {
		renderDragElement({
			component: {
				...COMPONENT,
				isContainer: true,
				props: [{ id: "containerId", type: "text", label: "Container id" }],
			},
		});

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({ component: { x: 50, y: 50 } });
		});

		expect(addElementMock).toHaveBeenCalledTimes(1);
		const nextProps = addElementMock.mock.calls[0][0].props;
		const containerIdProp = nextProps.find(
			(prop: WebBuilderElementProperty) => prop.propId === "containerId",
		);
		expect(containerIdProp.value).toBe("container-bp-id");
	});

	it("does not add the element twice for repeated onElementsChange calls once already added", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({ component: { x: 50, y: 50 } });
			latestPanZoomProps.onElementsChange({ component: { x: 51, y: 51 } });
		});

		expect(addElementMock).toHaveBeenCalledTimes(1);
	});

	it("ignores onElementsChange when position is outside the grid area", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({ component: { x: 9999, y: 9999 } });
		});

		expect(addElementMock).not.toHaveBeenCalled();
	});

	it("ignores onElementsChange when there is no position for the dragged component id", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({});
		});

		expect(addElementMock).not.toHaveBeenCalled();
	});

	it("skips grabbing the newly added element after the timeout if cancelled (mouseup) before it fires", () => {
		renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		act(() => {
			latestPanZoomProps.onElementsChange({ component: { x: 50, y: 50 } });
		});

		act(() => {
			window.dispatchEvent(new MouseEvent("mouseup"));
		});

		act(() => {
			vi.advanceTimersByTime(100);
		});

		expect(gridAPICurrent.grabElement).not.toHaveBeenCalled();
	});

	it("cleans up the mouseup listener and interval on unmount", () => {
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

		const { unmount } = renderDragElement();

		act(() => {
			vi.advanceTimersByTime(10);
		});

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"mouseup",
			expect.any(Function),
		);
	});
});
