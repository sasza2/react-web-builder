import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseBreakpoint = vi.fn();
vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/utils/element", () => ({
	getDefaultValue: vi.fn(() => "default-value"),
}));

let fieldValue: unknown[] = [];
const setValueMock = vi.fn((next: unknown[]) => {
	fieldValue = next;
});
vi.mock("@/components/FormProvider", () => ({
	useField: (name: string) => ({
		name,
		value: fieldValue,
		setValue: setValueMock,
	}),
}));

vi.mock("@/components/FormProperty", () => ({
	FormProperty: ({
		name,
		prop,
	}: {
		name: string;
		prop: { label?: React.ReactNode };
	}) => <div data-testid={`form-property-${name}`}>{prop?.label}</div>,
}));

import { getDefaultValue } from "@/utils/element";

import { FormArray } from "./FormArray";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("FormArray", () => {
	beforeEach(() => {
		fieldValue = [];
		setValueMock.mockClear();
		mockUseBreakpoint.mockReturnValue({ id: "bp1" });
	});

	it("renders label and empty container when value is empty", () => {
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		expect(screen.getByText("My Array")).not.toBeNull();
		expect(screen.queryByTestId(/form-property-/)).toBeNull();
	});

	it("renders one FormProperty per item and disables move buttons when < 2 items", () => {
		fieldValue = ["a"];
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		expect(screen.getByTestId("form-property-items.0")).not.toBeNull();
	});

	it("adds an item using getDefaultValue and current breakpoint", () => {
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		// with an empty value list, only the "add" ButtonIcon is rendered
		const buttons = document.querySelectorAll("button");
		expect(buttons.length).toBe(1);
		fireEvent.click(buttons[0]);

		expect(getDefaultValue).toHaveBeenCalledWith(
			{ label: "Item" },
			{ id: "bp1" },
		);
		expect(setValueMock).toHaveBeenCalledWith(["default-value"]);
	});

	it("moves items up, down, and removes them", () => {
		fieldValue = ["a", "b", "c"];
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		// buttons order: add, then per-item [moveUp, moveDown, trash] x3
		const buttons = document.querySelectorAll("button");
		expect(buttons.length).toBe(1 + 3 * 3);

		// moveUp first item (index 0): nextIndex = -1 -> wraps to length-1 (2)
		fireEvent.click(buttons[1]);
		expect(setValueMock).toHaveBeenLastCalledWith(["c", "b", "a"]);

		setValueMock.mockClear();
		// value is still ["a", "b", "c"] (component wasn't re-rendered with the
		// mutated array); moveDown last item (index 2): nextIndex 3 -> wraps to 0
		fireEvent.click(buttons[1 + 3 * 2 + 1]);
		expect(setValueMock).toHaveBeenLastCalledWith(["c", "b", "a"]);

		setValueMock.mockClear();
		// remove first item
		fireEvent.click(buttons[1 + 2]);
		expect(setValueMock).toHaveBeenLastCalledWith(["b", "c"]);
	});

	it("dedupes keys for identical items via JSON stringify + index suffix", () => {
		fieldValue = ["a", "a", "b"];
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		expect(screen.getByTestId("form-property-items.0")).not.toBeNull();
		expect(screen.getByTestId("form-property-items.1")).not.toBeNull();
		expect(screen.getByTestId("form-property-items.2")).not.toBeNull();
	});

	it("defaults value to an empty array when the field value is undefined", () => {
		fieldValue = undefined;
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		expect(screen.getByText("My Array")).not.toBeNull();
		expect(screen.queryByTestId(/form-property-/)).toBeNull();
	});

	it("moveUp/moveDown a middle item without wrapping the index", () => {
		fieldValue = ["a", "b", "c"];
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{ label: "Item" } as never}
			/>,
		);

		const buttons = document.querySelectorAll("button");
		// item index 1 ("b") buttons: [moveUp, moveDown, trash] at offset 1 + 3
		fireEvent.click(buttons[1 + 3]);
		expect(setValueMock).toHaveBeenLastCalledWith(["b", "a", "c"]);

		setValueMock.mockClear();
		fireEvent.click(buttons[1 + 3 + 1]);
		expect(setValueMock).toHaveBeenLastCalledWith(["a", "c", "b"]);
	});

	it("falls back to translation label when `of` has no label", () => {
		fieldValue = ["a"];
		renderWithTheme(
			<FormArray
				formCreatorId="form1"
				label="My Array"
				name="items"
				of={{} as never}
			/>,
		);

		expect(screen.getByTestId("form-property-items.0")).not.toBeNull();
	});
});
