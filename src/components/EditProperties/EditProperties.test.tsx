import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import type { WebBuilderComponent, WebBuilderElement } from "types";
import { describe, expect, it, vi } from "vitest";

vi.mock("../FormProperty", async () => {
	const { useField } = await import("@/components/FormProvider");
	return {
		FormProperty: ({ name }: { name: string }) => {
			const { value, setValue } = useField<string>(name);
			return (
				<input
					data-testid={`form-property-${name}`}
					value={(value as string) ?? ""}
					onChange={(e) => setValue(e.target.value)}
				/>
			);
		},
	};
});

const removeElementMock = vi.fn();
vi.mock("@/hooks/useRemoveElement", () => ({
	useRemoveElement: () => removeElementMock,
}));

import { GridAPIProvider } from "@/components/GridAPIProvider/GridAPIProvider";
import { PropertiesProvider } from "@/components/PropertiesProvider";
import { StyleProvider } from "@/components/StyleProvider";
import { createStore } from "@/store/store";

import { ElementsProvider } from "../ElementsProvider";
import { EditProperties } from "./EditProperties";

const breakpoint = {
	id: "bp1",
	from: 0,
	to: null,
	rowHeight: 10,
	cols: 12,
	padding: { top: 0, right: 0, bottom: 0, left: 0 },
};

const otherElement: WebBuilderElement = {
	id: "el0",
	componentName: "text-component",
	w: 4,
	x: 0,
	y: 1,
	props: [{ propId: "text", value: "untouched" }],
};

const element: WebBuilderElement = {
	id: "el1",
	componentName: "text-component",
	w: 4,
	x: 0,
	y: 0,
	props: [{ propId: "text", value: "hello" }],
};

const components: WebBuilderComponent[] = [
	{
		id: "text-component",
		label: "Text component",
		component: () => null,
		props: [
			{
				id: "text",
				type: "text",
				label: "Text",
			},
			{
				id: "extra",
				type: "text",
				label: "Extra",
				defaultValue: "extra-default",
			},
		],
	},
];

const buildStore = (
	overrides: Partial<Parameters<typeof createStore>[0]> = {},
) =>
	createStore({
		breakpoints: [breakpoint],
		selectedBreakpoint: "bp1",
		elementsInBreakpoints: { bp1: [otherElement, element] },
		selectedElement: "el1",
		...overrides,
	} as never);

const renderWithProviders = (ui: React.ReactElement, store = buildStore()) =>
	render(
		<Provider store={store}>
			<StyleProvider>
				<PropertiesProvider page={{ elementsExtras: {} } as never}>
					<GridAPIProvider>
						<ElementsProvider>{ui}</ElementsProvider>
					</GridAPIProvider>
				</PropertiesProvider>
			</StyleProvider>
		</Provider>,
	);

describe("EditProperties", () => {
	it("renders header with component label and the form property for the selected element", () => {
		renderWithProviders(<EditProperties components={components} />);

		expect(screen.getByText("Text component")).not.toBeNull();
		expect(screen.getByTestId("form-property-text")).not.toBeNull();
	});

	it("falls back to component id when no label is set", () => {
		const noLabelComponents: WebBuilderComponent[] = [
			{ ...components[0], label: undefined, id: "text-component" },
		];
		renderWithProviders(<EditProperties components={noLabelComponents} />);

		expect(screen.getByText("text-component")).not.toBeNull();
	});

	it("renders the translated not-found message when there is no matching component", () => {
		renderWithProviders(<EditProperties components={[]} />);

		expect(screen.getByText("element.notFound")).not.toBeNull();
	});

	it("clicking back clears the selected element id", () => {
		const store = buildStore();
		renderWithProviders(<EditProperties components={components} />, store);

		fireEvent.click(screen.getByTestId("sidebarBack"));

		expect(store.getState().selectedElement).toBeNull();
	});

	it("clicking remove calls removeElement with the selected element id", () => {
		const store = buildStore();
		renderWithProviders(<EditProperties components={components} />, store);

		fireEvent.click(screen.getByText("element.delete"));

		expect(removeElementMock).toHaveBeenCalledWith("el1");
	});

	it("filters out properties whose visibility function returns false", () => {
		const hiddenComponents: WebBuilderComponent[] = [
			{
				...components[0],
				props: [
					{
						id: "text",
						type: "text",
						label: "Text",
						visibility: () => false,
					} as never,
				],
			},
		];
		renderWithProviders(<EditProperties components={hiddenComponents} />);

		expect(screen.queryByTestId("form-property-text")).toBeNull();
	});

	it("propagates a form field change into the store after the debounce timeout", () => {
		vi.useFakeTimers();
		try {
			const store = buildStore();
			renderWithProviders(<EditProperties components={components} />, store);

			fireEvent.change(screen.getByTestId("form-property-text"), {
				target: { value: "updated" },
			});

			vi.advanceTimersByTime(250);

			const updatedElement = store
				.getState()
				.elementsInBreakpoints.bp1.find((el) => el.id === "el1");
			expect(
				updatedElement.props.find((prop) => prop.propId === "text").value,
			).toBe("updated");
		} finally {
			vi.useRealTimers();
		}
	});

	it("re-mounts (remounting the inner component) when the selected element id changes", () => {
		const store = buildStore();
		const { rerender } = renderWithProviders(
			<EditProperties components={components} />,
			store,
		);

		expect(screen.getByText("Text component")).not.toBeNull();

		store.dispatch({
			type: "elementsInBreakpoints/setElementsInBreakpoint",
			payload: {
				elements: [element, { ...element, id: "el2" }],
				breakpointId: "bp1",
			},
		});
		store.dispatch({
			type: "selectedElement/setSelectedElement",
			payload: { elementId: "el2" },
		});

		rerender(
			<Provider store={store}>
				<StyleProvider>
					<PropertiesProvider page={{ elementsExtras: {} } as never}>
						<GridAPIProvider>
							<ElementsProvider>
								<EditProperties components={components} />
							</ElementsProvider>
						</GridAPIProvider>
					</PropertiesProvider>
				</StyleProvider>
			</Provider>,
		);

		expect(screen.getByText("Text component")).not.toBeNull();
	});
});
