import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { describe, expect, it, vi } from "vitest";

const toggleSelectedElement = vi.fn();
let selectedElements: Array<string | number> = [];

vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({ selectedElements, toggleSelectedElement }),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { SelectElement } from "./SelectElement";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("SelectElement", () => {
	it("shows select label when not selected and toggles on click", () => {
		selectedElements = [];
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<SelectElement elementId="el-1" onClose={onClose} />,
		);

		expect(getByText("element.select")).not.toBeNull();
		fireEvent.click(getByText("element.select"));

		expect(toggleSelectedElement).toHaveBeenCalledWith("el-1");
		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("shows deselect label when already selected", () => {
		selectedElements = ["el-1"];
		const { getByText } = renderWithTheme(
			<SelectElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.deselect")).not.toBeNull();
	});
});
