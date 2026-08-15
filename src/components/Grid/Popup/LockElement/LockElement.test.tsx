import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { describe, expect, it, vi } from "vitest";

const dispatch = vi.fn();
let elements: Array<{ id: string | number; disabledMove?: boolean }> = [];
const breakpoint: { id: string } | null = { id: "bp-1" };

vi.mock("@/hooks/useElements", () => ({
	useElements: () => ({ elements }),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => breakpoint,
}));

vi.mock("@/store/useAppDispatch", () => ({
	useAppDispatch: () => dispatch,
}));

vi.mock("@/store/elementsInBreakpointsSlice", () => ({
	changeElementInBreakpoint: (payload: unknown) => ({
		type: "changeElementInBreakpoint",
		payload,
	}),
}));

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

import { LockElement } from "./LockElement";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("LockElement", () => {
	it("shows lock label when element is not locked", () => {
		elements = [{ id: "el-1", disabledMove: false }];
		const { getByText } = renderWithTheme(
			<LockElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.lock")).not.toBeNull();
	});

	it("shows unlock label when element is locked", () => {
		elements = [{ id: "el-1", disabledMove: true }];
		const { getByText } = renderWithTheme(
			<LockElement elementId="el-1" onClose={vi.fn()} />,
		);
		expect(getByText("element.unlock")).not.toBeNull();
	});

	it("dispatches toggled disabledMove and closes on click", () => {
		elements = [{ id: "el-1", disabledMove: false }];
		const onClose = vi.fn();
		const { getByText } = renderWithTheme(
			<LockElement elementId="el-1" onClose={onClose} />,
		);

		fireEvent.click(getByText("element.lock"));

		expect(dispatch).toHaveBeenCalledWith({
			type: "changeElementInBreakpoint",
			payload: {
				breakpointId: "bp-1",
				element: { id: "el-1", disabledMove: true },
			},
		});
		expect(onClose).toHaveBeenCalledTimes(1);
	});
});
