import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { describe, expect, it, vi } from "vitest";

const copyElement = vi.fn();
let selectedElements: Array<string | number> = [];

vi.mock("@/hooks/useCopyElements", () => ({
	useCopyElements: () => ({ copyElement }),
}));

vi.mock("@/hooks/useSelectedElements", () => ({
	useSelectedElements: () => ({ selectedElements }),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { CopyElement } from "./CopyElement";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("CopyElement", () => {
	it("shows copy label when not selected", () => {
		selectedElements = [];
		const { getByText } = renderWithTheme(
			<CopyElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.copy")).not.toBeNull();
	});

	it("shows copy label when selected alone", () => {
		selectedElements = ["el-1"];
		const { getByText } = renderWithTheme(
			<CopyElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.copy")).not.toBeNull();
	});

	it("shows copySelected label when selected among multiple", () => {
		selectedElements = ["el-1", "el-2"];
		const { getByText } = renderWithTheme(
			<CopyElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.copySelected")).not.toBeNull();
	});

	it("copies element and closes on click", () => {
		selectedElements = [];
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<CopyElement elementId="el-1" onClose={onClose} />,
		);

		fireEvent.click(getByText("element.copy"));

		expect(copyElement).toHaveBeenCalledWith("el-1");
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
