import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { beforeEach, describe, expect, it, vi } from "vitest";

let elements: Array<{ id: string | number; y: number }> = [];
let selectedElements: Array<string | number> = [];
const setSelectedElements = vi.fn();

const getElementsAboveRow = vi.fn();
const getElementsBelowRow = vi.fn();

vi.mock("@/hooks/useElements", () => ({
	useElements: () => ({ elements }),
}));

vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({ selectedElements, setSelectedElements }),
}));

vi.mock("@/utils/element", () => ({
	getElementsAboveRow: (...args: unknown[]) => getElementsAboveRow(...args),
	getElementsBelowRow: (...args: unknown[]) => getElementsBelowRow(...args),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { SelectMultipleElements } from "./SelectMultipleElements";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("SelectMultipleElements", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		elements = [
			{ id: "a", y: 1 },
			{ id: "b", y: 5 },
		];
		selectedElements = [];
	});

	it("renders nothing when nothing is selected and no elements above/below", () => {
		getElementsAboveRow.mockReturnValue([]);
		getElementsBelowRow.mockReturnValue([]);
		const { container } = renderWithTheme(
			<SelectMultipleElements onClose={vi.fn()} row={3} />,
		);
		expect(container.textContent).toBe("");
	});

	it("shows deselect option and clears selection on click", () => {
		selectedElements = ["a"];
		getElementsAboveRow.mockReturnValue([]);
		getElementsBelowRow.mockReturnValue([]);
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<SelectMultipleElements onClose={onClose} row={3} />,
		);

		fireEvent.click(getByText("element.deselect"));

		expect(setSelectedElements).toHaveBeenCalledWith([]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows selectAllAbove option and appends elements above on click", () => {
		selectedElements = ["existing"];
		getElementsAboveRow.mockReturnValue([{ id: "a" }]);
		getElementsBelowRow.mockReturnValue([]);
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<SelectMultipleElements onClose={onClose} row={3} />,
		);

		fireEvent.click(getByText("element.selectAllAbove"));

		expect(getElementsAboveRow).toHaveBeenCalledWith(elements, 4);
		expect(setSelectedElements).toHaveBeenCalledWith(["a", "existing"]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows selectAllBelow option and appends elements below on click", () => {
		selectedElements = ["existing"];
		getElementsAboveRow.mockReturnValue([]);
		getElementsBelowRow.mockReturnValue([{ id: "b" }]);
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<SelectMultipleElements onClose={onClose} row={3} />,
		);

		fireEvent.click(getByText("element.selectAllBelow"));

		expect(getElementsBelowRow).toHaveBeenCalledWith(elements, 2);
		expect(setSelectedElements).toHaveBeenCalledWith(["b", "existing"]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
