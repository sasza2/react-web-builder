import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { beforeEach, describe, expect, it, vi } from "vitest";

const removeElement = vi.fn();
const removeSelectedElements = vi.fn();
let selectedElements: Array<string | number> = [];

vi.mock("@/hooks/useRemoveElement", () => ({
	useRemoveElement: () => removeElement,
}));

vi.mock("@/hooks/useRemoveSelectedElements", () => ({
	default: () => removeSelectedElements,
}));

vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({ selectedElements }),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { RemoveElement } from "./RemoveElement";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("RemoveElement", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	it("shows delete label when not selected and removes single element", () => {
		selectedElements = [];
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<RemoveElement elementId="el-1" onClose={onClose} />,
		);

		expect(getByText("element.delete")).not.toBeNull();
		fireEvent.click(getByText("element.delete"));

		expect(removeElement).toHaveBeenCalledWith("el-1");
		expect(removeSelectedElements).not.toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows delete label when selected alone", () => {
		selectedElements = ["el-1"];
		const { getByText } = renderWithTheme(
			<RemoveElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.delete")).not.toBeNull();
	});

	it("shows deleteSelected label and removes selected elements when multiple selected", () => {
		selectedElements = ["el-1", "el-2"];
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<RemoveElement elementId="el-1" onClose={onClose} />,
		);

		expect(getByText("element.deleteSelected")).not.toBeNull();
		fireEvent.click(getByText("element.deleteSelected"));

		expect(removeSelectedElements).toHaveBeenCalledTimes(1);
		expect(removeElement).not.toHaveBeenCalled();
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
