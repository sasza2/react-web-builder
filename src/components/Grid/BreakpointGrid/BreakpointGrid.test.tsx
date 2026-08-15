import { render } from "@testing-library/react";
import React, { forwardRef } from "react";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const mockUseWebBuilderSizeHeight = vi.fn();
const mockUseBlurSelectedElement = vi.fn();
const mockUseBreakpoint = vi.fn();
const mockUseDeleteElementOnKey = vi.fn();
const mockUseElementOnStartResizing = vi.fn();
const mockUseFontImportInGrid = vi.fn();
const mockUseGetBreakpointWidth = vi.fn();
const mockUseGridPaste = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseSelectedElements = vi.fn();
const mockUseSetElementsHeight = vi.fn();
const mockUseSetGridElements = vi.fn();
const mockUseConfiguration = vi.fn();
const mockUseGridAPI = vi.fn();
const mockUseElementsWithRender = vi.fn();
const mockUseGridMovement = vi.fn();
const mockUseGridPositionInit = vi.fn();
const mockUseIsGridLoaded = vi.fn();
const mockUseOnContextMenu = vi.fn();
const mockUseOnElementClick = vi.fn();
const mockUseScroll = vi.fn();

vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSizeHeight: () => mockUseWebBuilderSizeHeight(),
}));

vi.mock("@/hooks/useBlurSelectedElement", () => ({
	useBlurSelectedElement: () => mockUseBlurSelectedElement(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useDeleteElementOnKey", () => ({
	useDeleteElementOnKey: () => mockUseDeleteElementOnKey(),
}));

vi.mock("@/hooks/useElementOnStartResizing", () => ({
	useElementOnStartResizing: () => mockUseElementOnStartResizing(),
}));

vi.mock("@/hooks/useFontImportInGrid", () => ({
	useFontImportInGrid: () => mockUseFontImportInGrid(),
}));

vi.mock("@/hooks/useGetBreakpointWidth", () => ({
	useGetBreakpointWidth: () => mockUseGetBreakpointWidth,
}));

vi.mock("@/hooks/useGridPaste", () => ({
	useGridPaste: () => mockUseGridPaste(),
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => mockUseSelectedElements(),
}));

vi.mock("@/hooks/useSetElementsHeight", () => ({
	useSetElementsHeight: () => mockUseSetElementsHeight(),
}));

vi.mock("@/hooks/useSetGridElements", () => ({
	useSetGridElements: () => mockUseSetGridElements(),
}));

vi.mock("../../ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
}));

vi.mock("../../GridAPIProvider/GridAPIProvider", () => ({
	useGridAPI: () => mockUseGridAPI(),
}));

vi.mock("../../RenderInContainer", () => ({
	RenderInContainer: ({ children }: React.PropsWithChildren) => (
		<div data-testid="render-in-container">{children}</div>
	),
}));

vi.mock("../ContainerBackground", () => ({
	ContainerBackground: () => <div data-testid="container-background" />,
}));

vi.mock("../DotBackground", () => ({
	DotBackground: () => <div data-testid="dot-background" />,
}));

vi.mock("../KeyboardEvents", () => ({
	KeyboardEvents: () => <div data-testid="keyboard-events" />,
}));

vi.mock("../Popup", () => ({
	Popup: ({ gridPaste }: { gridPaste: unknown }) => (
		<div data-testid="popup">{String(Boolean(gridPaste))}</div>
	),
}));

vi.mock("../useElementsWithRender", () => ({
	default: () => mockUseElementsWithRender(),
}));

vi.mock("../useGridMovement", () => ({
	default: () => mockUseGridMovement(),
}));

vi.mock("../useGridPositionInit", () => ({
	useGridPositionInit: (...args: unknown[]) => mockUseGridPositionInit(...args),
}));

vi.mock("../useIsGridLoaded", () => ({
	default: () => mockUseIsGridLoaded(),
}));

vi.mock("../useOnContextMenu", () => ({
	useOnContextMenu: () => mockUseOnContextMenu(),
}));

vi.mock("../useOnElementClick", () => ({
	default: () => mockUseOnElementClick(),
}));

vi.mock("../useScroll", () => ({
	useScroll: () => mockUseScroll(),
}));

let capturedGridProps: Record<string, unknown> = {};

vi.mock("react-grid-panzoom", () => ({
	__esModule: true,
	default: forwardRef((props: never, ref: never) => {
		capturedGridProps = props as never;
		if (typeof ref === "function") ref({});
		else if (ref) (ref as { current: unknown }).current = {};
		const { children } = props as { children: React.ReactNode };
		return <div data-testid="react-grid">{children}</div>;
	}),
	defaultOrganizeGridElements: "default-organize",
	organizeGridElementsWithBringUp: "organize-with-bring-up",
}));

import { BreakpointGrid } from "./BreakpointGrid";

describe("BreakpointGrid", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		capturedGridProps = {};
		mockUseWebBuilderSizeHeight.mockReturnValue(1000);
		mockUseBreakpoint.mockReturnValue({ id: "bp1", cols: 12, rowHeight: 10 });
		mockUseFontImportInGrid.mockReturnValue(null);
		mockUseGetBreakpointWidth.mockReturnValue(500);
		mockUseGridPaste.mockReturnValue({ pasteFn: vi.fn() });
		mockUsePageSettings.mockReturnValue({});
		mockUseSelectedElements.mockReturnValue({ selectedElements: [] });
		mockUseSetElementsHeight.mockReturnValue(vi.fn());
		mockUseSetGridElements.mockReturnValue(vi.fn());
		mockUseConfiguration.mockReturnValue({
			bringElementsAbove: false,
			helpLines: false,
			scrollSpeed: 0,
			gridZoomingInCenter: false,
		});
		mockUseGridAPI.mockReturnValue({ current: {} });
		mockUseElementsWithRender.mockReturnValue([]);
		mockUseGridMovement.mockReturnValue({});
		mockUseIsGridLoaded.mockReturnValue(true);
		mockUseOnContextMenu.mockReturnValue({
			menu: null,
			onContainerContextMenu: vi.fn(),
			onElementContextMenu: vi.fn(),
		});
		mockUseOnElementClick.mockReturnValue(vi.fn());
		mockUseScroll.mockReturnValue({
			scrollElement: <div data-testid="scroll-element" />,
			onScrollChange: vi.fn(),
		});
	});

	it("renders grid contents, container background when loaded, and keyboard events", () => {
		const { getByTestId } = render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(getByTestId("react-grid")).not.toBeNull();
		expect(getByTestId("container-background")).not.toBeNull();
		expect(getByTestId("dot-background")).not.toBeNull();
		expect(getByTestId("keyboard-events")).not.toBeNull();
		expect(getByTestId("scroll-element")).not.toBeNull();
	});

	it("does not render ContainerBackground while the grid is not loaded", () => {
		mockUseIsGridLoaded.mockReturnValue(false);

		const { queryByTestId } = render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(queryByTestId("container-background")).toBeNull();
	});

	it("renders the context menu Popup when a menu is present", () => {
		mockUseOnContextMenu.mockReturnValue({
			menu: { x: 0, y: 0 },
			onContainerContextMenu: vi.fn(),
			onElementContextMenu: vi.fn(),
		});

		const { getByTestId } = render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(getByTestId("popup")).not.toBeNull();
	});

	it("does not render Popup when there is no menu", () => {
		const { queryByTestId } = render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(queryByTestId("popup")).toBeNull();
	});

	it("renders the font import stylesheet when present", () => {
		mockUseFontImportInGrid.mockReturnValue({
			stylesheet: <style data-testid="font-stylesheet" />,
		});

		const { getByTestId } = render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(getByTestId("font-stylesheet")).not.toBeNull();
	});

	it("uses organizeGridElementsWithBringUp when configuration.bringElementsAbove is true", () => {
		mockUseConfiguration.mockReturnValue({
			bringElementsAbove: true,
			helpLines: false,
			scrollSpeed: 0,
			gridZoomingInCenter: false,
		});

		render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(capturedGridProps.organizeGridElements).toBe(
			"organize-with-bring-up",
		);
	});

	it("uses defaultOrganizeGridElements when configuration.bringElementsAbove is false", () => {
		render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(capturedGridProps.organizeGridElements).toBe("default-organize");
	});

	it("uses a centered zoom position when configuration.gridZoomingInCenter is true", () => {
		mockUseConfiguration.mockReturnValue({
			bringElementsAbove: false,
			helpLines: false,
			scrollSpeed: 0,
			gridZoomingInCenter: true,
		});

		render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(capturedGridProps.zoomPosition).toEqual({ x: "center" });
	});

	it("uses a null zoom position when configuration.gridZoomingInCenter is false", () => {
		render(
			<ThemeProvider theme={theme}>
				<BreakpointGrid />
			</ThemeProvider>,
		);

		expect(capturedGridProps.zoomPosition).toBeNull();
	});
});
