import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { describe, expect, it, vi } from "vitest";

const copyAllElements = vi.fn();

vi.mock("@/hooks/useCopyElements", () => ({
	useCopyElements: () => ({ copyAllElements }),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { CopyAllElements } from "./CopyAllElements";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("CopyAllElements", () => {
	it("copies all elements and closes on click", () => {
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<CopyAllElements onClose={onClose} />,
		);

		fireEvent.click(getByText("element.copyAll"));

		expect(copyAllElements).toHaveBeenCalledTimes(1);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
