import { act, render, waitFor } from "@testing-library/react";
import React, { forwardRef, useImperativeHandle } from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { ElementsContext } from "@/components/ElementsProvider";
import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

const mockUseProperties = vi.fn();
const mockUseComponentsProperty = vi.fn();
const mockUseFontImport = vi.fn();
const mockUsePageSettings = vi.fn();
const mockGetBreakpointWidth = vi.fn();
const mockUseBreakpointWaitForLoad = vi.fn();
const mockProduceRenderForElement = vi.fn();
const mockCalculatePositionsOfElements = vi.fn();
const mockGetElementsFromTree = vi.fn();
const mockAssignAllToElementsExtras = vi.fn();
const mockInitElementsExtrasFromBreakpoint = vi.fn();

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: () => mockUseComponentsProperty(),
}));

vi.mock("@/components/PropertiesProvider", () => ({
	useProperties: () => mockUseProperties(),
}));

vi.mock("@/components/RenderInContainer", () => ({
	RenderInContainer: ({ children }: React.PropsWithChildren) => (
		<div data-testid="render-in-container">{children}</div>
	),
}));

vi.mock("@/hooks/useFontImport", () => ({
	useFontImport: (...args: unknown[]) => mockUseFontImport(...args),
}));

vi.mock("@/hooks/useGetBreakpointWidth", () => ({
	useGetBreakpointWidth: () => mockGetBreakpointWidth,
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("./useBreakpointWaitForLoad", () => ({
	useBreakpointWaitForLoad: () => mockUseBreakpointWaitForLoad(),
}));

vi.mock("@/utils/breakpoint", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/breakpoint")>();
	return {
		...actual,
		assignAllToElementsExtras: (...args: unknown[]) =>
			mockAssignAllToElementsExtras(...args),
		initElementsExtrasFromBreakpoint: (...args: unknown[]) =>
			mockInitElementsExtrasFromBreakpoint(...args),
	};
});

vi.mock("@/utils/element", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/element")>();
	return {
		...actual,
		produceRenderForElement: (...args: unknown[]) =>
			mockProduceRenderForElement(...args),
	};
});

vi.mock("@/utils/templates", async (importOriginal) => {
	const actual = await importOriginal<typeof import("@/utils/templates")>();
	return {
		...actual,
		calculatePositionsOfElements: (...args: unknown[]) =>
			mockCalculatePositionsOfElements(...args),
		getElementsFromTree: (...args: unknown[]) =>
			mockGetElementsFromTree(...args),
	};
});

let capturedSetElements: ((elements: unknown[]) => void) | undefined;
let capturedElements: unknown[] | undefined;
const organizeElements = vi.fn();
const measureElementHeight = vi.fn(() => 10);

vi.mock("react-grid-panzoom", () => ({
	default: forwardRef((props: never, ref: never) => {
		const { elements, setElements } = props as {
			elements: unknown[];
			setElements: (elements: unknown[]) => void;
		};
		capturedElements = elements;
		capturedSetElements = setElements;
		useImperativeHandle(ref, () => ({
			organizeElements,
			measureElementHeight,
		}));
		return <div data-testid="react-grid" />;
	}),
}));

import { LoadBreakpoint } from "./LoadBreakpoint";

const breakpoint = {
	id: "bp1",
	cols: 12,
	rowHeight: 10,
	from: 0,
	template: { type: "column", children: [] },
} as never;

const renderComponent = ({
	onFinishLoading = vi.fn(),
	onStartLoading = vi.fn(),
}: {
	onFinishLoading?: () => void;
	onStartLoading?: () => void;
} = {}) => {
	const store = createStore({});
	const utils = render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<ElementsContext.Provider
					value={{
						elements: [],
						elementsCache: { current: new Map() } as never,
						elementsExtras: { current: {} } as never,
					}}
				>
					<LoadBreakpoint
						breakpoint={breakpoint}
						onFinishLoading={onFinishLoading}
						onStartLoading={onStartLoading}
					/>
				</ElementsContext.Provider>
			</ThemeProvider>
		</Provider>,
	);
	return { ...utils, onFinishLoading, onStartLoading };
};

describe("LoadBreakpoint", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseProperties.mockReturnValue({
			page: { id: "page1" },
			transformElementProperty: undefined,
		});
		mockUseComponentsProperty.mockReturnValue([]);
		mockUseFontImport.mockReturnValue(null);
		mockUsePageSettings.mockReturnValue({ fontFamily: "Inter" });
		mockGetBreakpointWidth.mockReturnValue(500);
		mockGetElementsFromTree.mockReturnValue([]);
		mockProduceRenderForElement.mockReturnValue([vi.fn(), false]);
		mockCalculatePositionsOfElements.mockReturnValue([
			{ id: "el1", x: 0, y: 0, w: 1, h: 1 },
		]);
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	it("calls onStartLoading, waits for load, organizes elements, and calls onFinishLoading on success", async () => {
		const waitPromise = Promise.resolve();
		const continueWaiting = vi.fn();
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			continueWaiting,
		]);

		const { onFinishLoading, onStartLoading } = renderComponent();

		await waitFor(
			() => expect(onFinishLoading).toHaveBeenCalledWith(breakpoint),
			{ timeout: 3000 },
		);

		expect(onStartLoading).toHaveBeenCalledWith(breakpoint);
		expect(organizeElements).toHaveBeenCalled();
		expect(mockCalculatePositionsOfElements).toHaveBeenCalled();
		expect(mockInitElementsExtrasFromBreakpoint).toHaveBeenCalled();
		expect(mockAssignAllToElementsExtras).toHaveBeenCalled();
	});

	it("works without an onStartLoading callback", async () => {
		const waitPromise = Promise.resolve();
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			vi.fn(),
		]);

		const store = createStore({});
		const onFinishLoading = vi.fn();
		render(
			<Provider store={store}>
				<ThemeProvider theme={theme}>
					<ElementsContext.Provider
						value={{
							elements: [],
							elementsCache: { current: new Map() } as never,
							elementsExtras: { current: {} } as never,
						}}
					>
						<LoadBreakpoint
							breakpoint={breakpoint}
							onFinishLoading={onFinishLoading}
						/>
					</ElementsContext.Provider>
				</ThemeProvider>
			</Provider>,
		);

		await waitFor(() => expect(onFinishLoading).toHaveBeenCalled(), {
			timeout: 3000,
		});
	});

	it("does not call onFinishLoading and stops silently if organizeElements throws", async () => {
		const waitPromise = Promise.resolve();
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			vi.fn(),
		]);
		organizeElements.mockImplementationOnce(() => {
			throw new Error("boom");
		});
		const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

		const { onFinishLoading } = renderComponent();

		await waitFor(() => expect(warnSpy).toHaveBeenCalled());

		expect(onFinishLoading).not.toHaveBeenCalled();
		expect(mockAssignAllToElementsExtras).not.toHaveBeenCalled();

		warnSpy.mockRestore();
	});

	it("does not finish loading if unmounted before the wait promise resolves", async () => {
		let resolveWait: () => void = () => {};
		const waitPromise = new Promise<void>((resolve) => {
			resolveWait = resolve;
		});
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			vi.fn(),
		]);

		const { onFinishLoading, unmount } = renderComponent();

		unmount();
		await act(async () => {
			resolveWait();
			await waitPromise;
		});

		expect(onFinishLoading).not.toHaveBeenCalled();
	});

	it("calls continueWaiting and skips dispatch when setElements is invoked before elements finished loading", async () => {
		let resolveWait: () => void = () => {};
		const waitPromise = new Promise<void>((resolve) => {
			resolveWait = resolve;
		});
		const continueWaiting = vi.fn();
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			continueWaiting,
		]);

		renderComponent();

		act(() => {
			capturedSetElements?.([{ id: "x", render: vi.fn() }]);
		});

		expect(continueWaiting).toHaveBeenCalled();

		await act(async () => {
			resolveWait();
			await waitPromise;
		});
	});

	it("dispatches and updates elements when setElements is invoked after elements finished loading", async () => {
		const waitPromise = Promise.resolve();
		mockUseBreakpointWaitForLoad.mockReturnValue([
			{ current: waitPromise },
			vi.fn(),
		]);

		const { onFinishLoading } = renderComponent();

		await waitFor(() => expect(onFinishLoading).toHaveBeenCalled(), {
			timeout: 3000,
		});

		act(() => {
			capturedSetElements?.([
				{ id: "el1", x: 0, y: 0, w: 1, h: 1, render: vi.fn() },
			]);
		});

		expect(capturedElements).toBeDefined();
	});
});
