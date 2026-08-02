import { act, fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { ThemeProvider } from "styled-components";
import { beforeEach, describe, expect, it, vi } from "vitest";

import theme from "@/components/StyleProvider/theme";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockClearHintsFromLocalStorage = vi.fn();
const mockUseBuilderHintsList = vi.fn();
const mockUseContainerHintsList = vi.fn();
const mockUseBreakpoint = vi.fn();
const mockUseSetSidebarView = vi.fn();
const mockUseConfiguration = vi.fn();
const mockUseSetConfiguration = vi.fn();

vi.mock("@/components/Hints/clearHintsFromLocalStorage", () => ({
	clearHintsFromLocalStorage: (...args: unknown[]) =>
		mockClearHintsFromLocalStorage(...args),
}));

vi.mock("@/components/Hints/useBuilderHintsList", () => ({
	useBuilderHintsList: () => mockUseBuilderHintsList(),
}));

vi.mock("@/hooks/container/useContainerHintsList", () => ({
	useContainerHintsList: () => mockUseContainerHintsList(),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useSetSidebarView", () => ({
	useSetSidebarView: () => mockUseSetSidebarView(),
}));

vi.mock("../../ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
	useSetConfiguration: () => mockUseSetConfiguration(),
}));

import { ShowHelperTips } from "./ShowHelperTips";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe("ShowHelperTips", () => {
	const setSidebarView = vi.fn();
	const setConfiguration = vi.fn();

	beforeEach(() => {
		vi.clearAllMocks();
		mockUseBuilderHintsList.mockReturnValue([{ selector: ".a", title: "A" }]);
		mockUseContainerHintsList.mockReturnValue([{ selector: ".b", title: "B" }]);
		mockUseSetSidebarView.mockReturnValue(setSidebarView);
		mockUseConfiguration.mockReturnValue({ builderHintsId: 3 });
		mockUseSetConfiguration.mockReturnValue(setConfiguration);
	});

	it("renders the header, label, and button", () => {
		mockUseBreakpoint.mockReturnValue(null);
		renderWithTheme(<ShowHelperTips />);

		expect(screen.getByText("configuration.tips.header")).not.toBeNull();
		expect(screen.getByText("configuration.tips.label")).not.toBeNull();
		expect(screen.getByText("configuration.tips.button")).not.toBeNull();
	});

	it("clears hints and bumps builderHintsId without switching sidebar view when there is no breakpoint", async () => {
		mockUseBreakpoint.mockReturnValue(null);
		renderWithTheme(<ShowHelperTips />);

		await act(async () => {
			fireEvent.click(screen.getByText("configuration.tips.button"));
		});

		expect(setSidebarView).not.toHaveBeenCalled();
		expect(mockClearHintsFromLocalStorage).toHaveBeenCalledWith([
			{ selector: ".a", title: "A" },
			{ selector: ".b", title: "B" },
		]);
		expect(setConfiguration).toHaveBeenCalledWith({
			builderHintsId: 4,
		});
	});

	it("switches to the AddElement sidebar view and waits before clearing hints when a breakpoint is selected", async () => {
		vi.useFakeTimers();
		mockUseBreakpoint.mockReturnValue({ id: "bp-1" });
		renderWithTheme(<ShowHelperTips />);

		fireEvent.click(screen.getByText("configuration.tips.button"));

		expect(setSidebarView).toHaveBeenCalledWith(1);

		await act(async () => {
			await vi.advanceTimersByTimeAsync(300);
		});

		expect(mockClearHintsFromLocalStorage).toHaveBeenCalled();
		expect(setConfiguration).toHaveBeenCalledWith({ builderHintsId: 4 });

		vi.useRealTimers();
	});
});
