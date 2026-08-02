import { render } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";
import { createStore } from "@/store/store";

const mockUseBreakpoints = vi.fn();
const mockUseComponentsProperty = vi.fn();

vi.mock("@/hooks/useBreakpoints", () => ({
	useBreakpoints: () => mockUseBreakpoints(),
}));

vi.mock("@/components/ComponentsProvider", () => ({
	useComponentsProperty: () => mockUseComponentsProperty(),
}));

import { ContainerBottomLine } from "./ContainerBottomLine";

const CONTAINER_COMPONENT = "container-component";

const renderWithStore = (
	breakpoint: unknown,
	elementsInBreakpoints: Record<string, unknown[]>,
) => {
	const store = createStore({
		elementsInBreakpoints: elementsInBreakpoints as never,
	});
	return render(
		<Provider store={store}>
			<ThemeProvider theme={theme}>
				<ContainerBottomLine breakpoint={breakpoint as never} />
			</ThemeProvider>
		</Provider>,
	);
};

describe("ContainerBottomLine", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseComponentsProperty.mockReturnValue([
			{ id: CONTAINER_COMPONENT, isContainer: true },
			{ id: "non-container", isContainer: false },
		]);
	});

	it("returns null when breakpoint has no parentId", () => {
		mockUseBreakpoints.mockReturnValue([]);

		const { container } = renderWithStore({ id: "bp1", parentId: null }, {});

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the parent breakpoint cannot be found", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "other" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when no element in the parent breakpoint matches this container", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{ "parent-1": [] },
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the matching element is not a container component", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: "non-container",
						props: [{ propId: "containerId", value: "bp1" }],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the container element has no containerId prop", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: CONTAINER_COMPONENT,
						props: [],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the containerId does not match this breakpoint", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: CONTAINER_COMPONENT,
						props: [{ propId: "containerId", value: "other-bp" }],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the matching element has no breakpointHeight prop", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: CONTAINER_COMPONENT,
						props: [{ propId: "containerId", value: "bp1" }],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when breakpointHeight value has no height", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: CONTAINER_COMPONENT,
						props: [
							{ propId: "containerId", value: "bp1" },
							{ propId: "breakpointHeight", value: { height: 0 } },
						],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("returns null when the floored breakpointHeight is 0", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: CONTAINER_COMPONENT,
						props: [
							{ propId: "containerId", value: "bp1" },
							{
								propId: "breakpointHeight",
								value: { enabled: true, height: 0.4 },
							},
						],
					},
				],
			},
		);

		expect(container.firstChild).toBeNull();
	});

	it("renders the Line with the floored breakpointHeight when a matching container element is found", () => {
		mockUseBreakpoints.mockReturnValue([{ id: "parent-1" }]);

		const { container } = renderWithStore(
			{ id: "bp1", parentId: "parent-1" },
			{
				"parent-1": [
					{
						componentName: "non-container",
						props: [{ propId: "containerId", value: "bp1" }],
					},
					{
						componentName: CONTAINER_COMPONENT,
						props: [
							{ propId: "containerId", value: "bp1" },
							{
								propId: "breakpointHeight",
								value: { enabled: true, height: 123.7 },
							},
						],
					},
				],
			},
		);

		expect(container.firstChild).not.toBeNull();
	});
});
