import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { Paste } from "./Paste";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Paste", () => {
	it("pastes at the given position and closes on click", () => {
		const gridPaste = vi.fn();
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<Paste col={3} row={5} gridPaste={gridPaste} onClose={onClose} />,
		);

		fireEvent.click(getByText("element.paste"));

		expect(gridPaste).toHaveBeenCalledWith(3, 5);
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
