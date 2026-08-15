import { act, fireEvent, render } from "@testing-library/react";
import type { ComponentProps } from "react";
import React from "react";
import { ThemeProvider } from "styled-components";

import theme from "@/components/StyleProvider/theme";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const hasClipboard = vi.fn();

vi.mock("@/utils/clipboard", () => ({
	hasClipboard: () => hasClipboard(),
}));

vi.mock("@/components/WebBuilderSize", () => ({
	useWebBuilderSize: () => ({ width: 500, height: 400 }),
}));

vi.mock("./CopyAllElements", () => ({
	CopyAllElements: (
		props: ComponentProps<typeof import("./CopyAllElements").CopyAllElements>,
	) => <button type="button" data-testid="copy-all" onClick={props.onClose} />,
}));
vi.mock("./CopyElement", () => ({
	CopyElement: (
		props: ComponentProps<typeof import("./CopyElement").CopyElement>,
	) => <div data-testid="copy-element" data-element-id={props.elementId} />,
}));
vi.mock("./LockElement", () => ({
	LockElement: (
		props: ComponentProps<typeof import("./LockElement").LockElement>,
	) => <div data-testid="lock-element" data-element-id={props.elementId} />,
}));
vi.mock("./Paste", () => ({
	Paste: (props: ComponentProps<typeof import("./Paste").Paste>) => (
		<div data-testid="paste" data-col={props.col} data-row={props.row} />
	),
}));
vi.mock("./RemoveElement", () => ({
	RemoveElement: (
		props: ComponentProps<typeof import("./RemoveElement").RemoveElement>,
	) => <div data-testid="remove-element" data-element-id={props.elementId} />,
}));
vi.mock("./RemoveEmptySpaceBelow", () => ({
	RemoveEmptySpaceBelow: (
		props: ComponentProps<
			typeof import("./RemoveEmptySpaceBelow").RemoveEmptySpaceBelow
		>,
	) => <div data-testid="remove-empty-space-below" data-row={props.row} />,
}));
vi.mock("./SelectElement", () => ({
	SelectElement: (
		props: ComponentProps<typeof import("./SelectElement").SelectElement>,
	) => <div data-testid="select-element" data-element-id={props.elementId} />,
}));
vi.mock("./SelectMultipleElements", () => ({
	SelectMultipleElements: (
		props: ComponentProps<
			typeof import("./SelectMultipleElements").SelectMultipleElements
		>,
	) => <div data-testid="select-multiple-elements" data-row={props.row} />,
}));

import { Popup } from "./Popup";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("Popup", () => {
	beforeEach(() => {
		vi.useFakeTimers({ shouldAdvanceTime: true });
		hasClipboard.mockReturnValue(false);
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.clearAllMocks();
	});

	const baseMenu = {
		col: 2,
		row: 3,
		position: { x: 10, y: 20 },
	};

	it("renders single-element options when menu.elementId is set", () => {
		const { getByTestId, queryByTestId } = renderWithTheme(
			<Popup
				gridPaste={vi.fn()}
				onClose={vi.fn()}
				menu={{ ...baseMenu, elementId: "el-1" }}
			/>,
		);

		expect(getByTestId("select-element").getAttribute("data-element-id")).toBe(
			"el-1",
		);
		expect(getByTestId("copy-element")).not.toBeNull();
		expect(getByTestId("lock-element")).not.toBeNull();
		expect(getByTestId("remove-element")).not.toBeNull();
		expect(queryByTestId("select-multiple-elements")).toBeNull();
		expect(queryByTestId("copy-all")).toBeNull();
	});

	it("renders multi-element options when menu.elementId is absent, without paste when clipboard is empty", () => {
		hasClipboard.mockReturnValue(false);
		const { getByTestId, queryByTestId } = renderWithTheme(
			<Popup gridPaste={vi.fn()} onClose={vi.fn()} menu={baseMenu} />,
		);

		expect(getByTestId("select-multiple-elements")).not.toBeNull();
		expect(getByTestId("remove-empty-space-below")).not.toBeNull();
		expect(getByTestId("copy-all")).not.toBeNull();
		expect(queryByTestId("paste")).toBeNull();
	});

	it("renders paste option when clipboard has content", () => {
		hasClipboard.mockReturnValue(true);
		const { getByTestId } = renderWithTheme(
			<Popup gridPaste={vi.fn()} onClose={vi.fn()} menu={baseMenu} />,
		);

		const paste = getByTestId("paste");
		expect(paste.getAttribute("data-col")).toBe("2");
		expect(paste.getAttribute("data-row")).toBe("3");
	});

	it("closes after clicking outside the popup, after a delay", () => {
		const onClose = vi.fn();
		renderWithTheme(
			<Popup gridPaste={vi.fn()} onClose={onClose} menu={baseMenu} />,
		);

		act(() => {
			fireEvent.click(document.body);
		});

		expect(onClose).not.toHaveBeenCalled();

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(onClose).toHaveBeenCalledTimes(1);
	});

	it("does not close when clicking inside the popup container", () => {
		const onClose = vi.fn();
		const { getByTestId } = renderWithTheme(
			<Popup gridPaste={vi.fn()} onClose={onClose} menu={baseMenu} />,
		);

		act(() => {
			fireEvent.click(getByTestId("select-multiple-elements"));
		});

		act(() => {
			vi.advanceTimersByTime(300);
		});

		expect(onClose).not.toHaveBeenCalled();
	});

	it("cleans up the click listener and timer on unmount", () => {
		const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");
		const { unmount } = renderWithTheme(
			<Popup gridPaste={vi.fn()} onClose={vi.fn()} menu={baseMenu} />,
		);

		unmount();

		expect(removeEventListenerSpy).toHaveBeenCalledWith(
			"click",
			expect.any(Function),
		);
		removeEventListenerSpy.mockRestore();
	});
});
