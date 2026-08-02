import { fireEvent, render, screen } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { ThemeProvider } from "styled-components";
import type { WebBuilderComponent } from "types";
import { afterEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

const goBackMock = vi.fn();
let gridTop = 10;

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
	withTranslation:
		() =>
		<Props,>(Component: Props) =>
			Component,
}));

vi.mock("@/hooks/useGridPositionTop", () => ({
	useGridPositionTop: () => gridTop,
}));

vi.mock("@/hooks/useSidebarContainerEditGoBack", () => ({
	useSidebarContainerEditGoBack: () => goBackMock,
}));

vi.mock("../SidebarProvider", () => ({
	useSelectNewElementAccordion: () => ({
		preExpanded: [],
		onChange: vi.fn(),
	}),
}));

vi.mock("@/components/DragElement", () => ({
	DragElement: ({
		children,
		onCancel,
		onSuccess,
	}: ComponentProps<typeof import("@/components/DragElement").DragElement>) => (
		<div data-testid="drag-element">
			{children}
			<button type="button" onClick={onCancel}>
				cancel-drag
			</button>
			<button type="button" onClick={onSuccess}>
				success-drag
			</button>
		</div>
	),
}));

import { SelectNewElement } from "./SelectNewElement";

afterEach(() => {
	vi.clearAllMocks();
	gridTop = 10;
});

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

const buildComponent = (
	overrides: Partial<WebBuilderComponent> = {},
): WebBuilderComponent =>
	({
		id: "Text",
		label: "Text",
		component: () => null,
		props: [],
		...overrides,
	}) as WebBuilderComponent;

describe("SelectNewElement", () => {
	it("renders the header title", () => {
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		expect(screen.getByText("selectNewElement.title")).not.toBeNull();
	});

	it("groups components without a group under the default 'other' group", () => {
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		expect(screen.getByText("group.other")).not.toBeNull();
	});

	it("groups components with an empty group array under the default group", () => {
		renderWithTheme(
			<SelectNewElement components={[buildComponent({ group: [] })]} />,
		);

		expect(screen.getByText("group.other")).not.toBeNull();
	});

	it("groups a component with a single group object", () => {
		renderWithTheme(
			<SelectNewElement
				components={[
					buildComponent({ group: { id: "layout", label: "Layout" } }),
				]}
			/>,
		);

		expect(screen.getByText("Layout")).not.toBeNull();
	});

	it("groups a component present in multiple groups, adding it to each", () => {
		renderWithTheme(
			<SelectNewElement
				components={[
					buildComponent({
						group: [
							{ id: "a", label: "GroupA" },
							{ id: "b", label: "GroupB" },
						],
					}),
				]}
			/>,
		);

		expect(screen.getByText("GroupA")).not.toBeNull();
		expect(screen.getByText("GroupB")).not.toBeNull();
	});

	it("sorts groups and components by order", () => {
		renderWithTheme(
			<SelectNewElement
				components={[
					buildComponent({
						id: "Second",
						label: "Second",
						order: 2,
						group: { id: "g1", label: "G1", order: 2 },
					}),
					buildComponent({
						id: "First",
						label: "First",
						order: 1,
						group: { id: "g0", label: "G0", order: 1 },
					}),
				]}
			/>,
		);

		const buttons = screen.getAllByRole("button", { name: /G0|G1/ });
		expect(buttons[0].textContent).toContain("G0");
		expect(buttons[1].textContent).toContain("G1");
	});

	it("assigns multiple components to the same group and merges them", () => {
		renderWithTheme(
			<SelectNewElement
				components={[
					buildComponent({
						id: "One",
						label: "One",
						group: { id: "shared", label: "Shared" },
					}),
					buildComponent({
						id: "Two",
						label: "Two",
						group: { id: "shared", label: "Shared" },
					}),
				]}
			/>,
		);

		expect(screen.getAllByText("Shared").length).toBe(1);
		expect(screen.getByText("One")).not.toBeNull();
		expect(screen.getByText("Two")).not.toBeNull();
	});

	it("differentiates keys for components sharing the same id via props", () => {
		const component = buildComponent({
			id: "Dup",
			label: "Dup",
			props: [{ id: "p1", type: "text", label: "P1" }],
		});

		renderWithTheme(<SelectNewElement components={[component]} />);

		expect(screen.getByText("Dup")).not.toBeNull();
	});

	it("does not start a drag when a non-primary mouse button is used", () => {
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		const target = screen.getByText("Text").closest('[data-id="component"]');
		fireEvent.mouseDown(target as Element, { button: 1 });

		expect(screen.queryByTestId("drag-element")).toBeNull();
	});

	it("starts a drag on primary mouse-down over a component and can cancel it", () => {
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		const target = screen.getByText("Text").closest('[data-id="component"]');
		fireEvent.mouseDown(target as Element, {
			button: 0,
			clientX: 50,
			clientY: 60,
		});

		expect(screen.getByTestId("drag-element")).not.toBeNull();

		fireEvent.click(screen.getByText("cancel-drag"));
		expect(screen.queryByTestId("drag-element")).toBeNull();
	});

	it("clears the drag element on success", () => {
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		const target = screen.getByText("Text").closest('[data-id="component"]');
		fireEvent.mouseDown(target as Element, {
			button: 0,
			clientX: 0,
			clientY: 0,
		});

		expect(screen.getByTestId("drag-element")).not.toBeNull();

		fireEvent.click(screen.getByText("success-drag"));
		expect(screen.queryByTestId("drag-element")).toBeNull();
	});

	it("renders without a back button when goBack is undefined", () => {
		goBackMock.mockImplementationOnce(() => undefined);
		renderWithTheme(<SelectNewElement components={[buildComponent()]} />);

		expect(screen.getByText("selectNewElement.title")).not.toBeNull();
	});
});
