import { act, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";

import { createStore } from "@/store/store";

import { LoadTemplateForPage } from "./LoadTemplateForPage";

const mockUseWebBuilderProperties = vi.fn();

vi.mock("@/components/PropertiesProvider", () => ({
	useWebBuilderProperties: () => mockUseWebBuilderProperties(),
}));

type LoadMultipleBreakpointsProps = ComponentProps<
	typeof import("../LoadMultipleBreakpoints").LoadMultipleBreakpoints
>;

let loadMultipleBreakpointsProps: LoadMultipleBreakpointsProps | null = null;

vi.mock("../LoadMultipleBreakpoints", () => ({
	LoadMultipleBreakpoints: (props: LoadMultipleBreakpointsProps) => {
		loadMultipleBreakpointsProps = props;
		return <div data-testid="load-multiple-breakpoints" />;
	},
}));

const renderWithStore = (ui: React.ReactElement, preloadedState = {}) => {
	const store = createStore(preloadedState);
	return { ...render(<Provider store={store}>{ui}</Provider>), store };
};

describe("LoadTemplateForPage", () => {
	beforeEach(() => {
		loadMultipleBreakpointsProps = null;
	});

	it("renders children directly when the page has no template to load", () => {
		mockUseWebBuilderProperties.mockReturnValue({ page: null });

		const { getByText, queryByTestId } = renderWithStore(
			<LoadTemplateForPage>
				<span>content</span>
			</LoadTemplateForPage>,
		);

		expect(getByText("content")).not.toBeNull();
		expect(queryByTestId("load-multiple-breakpoints")).toBeNull();
	});

	it("renders LoadMultipleBreakpoints with breakpoints needing a template while loading", () => {
		const page = {
			breakpoints: [
				{ id: "bp-1", template: { type: "root" }, elementsExtras: {} },
				{ id: "bp-2" },
			],
			elementsExtras: {},
		};
		mockUseWebBuilderProperties.mockReturnValue({ page });

		const { getByTestId, queryByText } = renderWithStore(
			<LoadTemplateForPage>
				<span>content</span>
			</LoadTemplateForPage>,
		);

		expect(getByTestId("load-multiple-breakpoints")).not.toBeNull();
		expect(queryByText("content")).toBeNull();
		expect(loadMultipleBreakpointsProps?.breakpoints).toEqual([
			page.breakpoints[0],
		]);
	});

	it("stops loading and commits history when afterLoadingAll fires", () => {
		const page = {
			breakpoints: [{ id: "bp-1", template: { type: "root" } }],
			elementsExtras: {},
		};
		mockUseWebBuilderProperties.mockReturnValue({ page });

		const { getByText, store } = renderWithStore(
			<LoadTemplateForPage>
				<span>content</span>
			</LoadTemplateForPage>,
		);

		expect(loadMultipleBreakpointsProps?.afterLoadingAll).toBeInstanceOf(
			Function,
		);

		act(() => {
			loadMultipleBreakpointsProps?.afterLoadingAll?.();
		});

		expect(getByText("content")).not.toBeNull();
		expect(store.getState().changes.initial).toBeDefined();
	});
});
