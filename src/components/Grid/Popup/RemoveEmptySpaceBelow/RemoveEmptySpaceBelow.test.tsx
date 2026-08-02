import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { beforeEach, describe, expect, it, vi } from "vitest";

let elements: Array<{ id: string | number; y: number }> = [];
const setElements = vi.fn();
const measureElementHeight = vi.fn();
const gridAPIRef = { current: { measureElementHeight } };

const hasAnyElementAtRowPosition = vi.fn();
const getFirstElementBelowRow = vi.fn();
const getElementsBelowRow = vi.fn();
const groupElementsById = vi.fn();

vi.mock("@/components/GridAPIProvider", () => ({
	useGridAPI: () => gridAPIRef,
}));

vi.mock("@/hooks/useElements", () => ({
	useElements: () => ({ elements }),
}));

vi.mock("@/hooks/useSetElements", () => ({
	useSetElements: () => setElements,
}));

vi.mock("@/utils/element", () => ({
	getElementsBelowRow: (...args: unknown[]) => getElementsBelowRow(...args),
	getFirstElementBelowRow: (...args: unknown[]) =>
		getFirstElementBelowRow(...args),
	groupElementsById: (...args: unknown[]) => groupElementsById(...args),
	hasAnyElementAtRowPosition: (...args: unknown[]) =>
		hasAnyElementAtRowPosition(...args),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { RemoveEmptySpaceBelow } from "./RemoveEmptySpaceBelow";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("RemoveEmptySpaceBelow", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		elements = [
			{ id: "a", y: 1 },
			{ id: "b", y: 5 },
		];
	});

	it("renders nothing when an element occupies the row", () => {
		hasAnyElementAtRowPosition.mockReturnValue(true);
		const { container } = renderWithTheme(
			<RemoveEmptySpaceBelow onClose={vi.fn()} row={2} />,
		);
		expect(container.textContent).toBe("");
	});

	it("renders nothing when no element exists below the row", () => {
		hasAnyElementAtRowPosition.mockReturnValue(false);
		getFirstElementBelowRow.mockReturnValue(undefined);
		const { container } = renderWithTheme(
			<RemoveEmptySpaceBelow onClose={vi.fn()} row={2} />,
		);
		expect(container.textContent).toBe("");
	});

	it("renders the option and moves elements up on click", () => {
		hasAnyElementAtRowPosition.mockReturnValue(false);
		getFirstElementBelowRow.mockReturnValue({ id: "b", y: 5 });
		getElementsBelowRow.mockReturnValue([{ id: "b", y: 5 }]);
		groupElementsById.mockReturnValue({ b: { id: "b", y: 5 } });

		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<RemoveEmptySpaceBelow onClose={onClose} row={2} />,
		);

		expect(getByText("element.removeEmptySpaceBelow")).not.toBeNull();

		fireEvent.click(getByText("element.removeEmptySpaceBelow"));

		expect(setElements).toHaveBeenCalledWith([
			{ id: "a", y: 1 },
			{ id: "b", y: 2 },
		]);
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does nothing on click if no element below found (defensive branch)", () => {
		hasAnyElementAtRowPosition.mockReturnValueOnce(false);
		getFirstElementBelowRow.mockReturnValueOnce({ id: "b", y: 5 });

		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<RemoveEmptySpaceBelow onClose={onClose} row={2} />,
		);

		// Second call (inside click handler) returns undefined to hit early-return
		getFirstElementBelowRow.mockReturnValueOnce(undefined);

		fireEvent.click(getByText("element.removeEmptySpaceBelow"));

		expect(setElements).not.toHaveBeenCalled();
		expect(onClose).not.toHaveBeenCalled();
	});
});
