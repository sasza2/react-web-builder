import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUsePageSettings = vi.fn();
const mockUseSetSidebarView = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("@/hooks/useSetSidebarView", () => ({
	useSetSidebarView: () => mockUseSetSidebarView(),
}));

vi.mock("../Button", () => ({
	RemoveGhostButton: ({
		children,
		onClick,
	}: React.PropsWithChildren<{ onClick: React.MouseEventHandler }>) => (
		<button type="button" data-testid="remove-ghost" onClick={onClick}>
			{children}
		</button>
	),
}));

vi.mock("../forms/ColorPicker", () => ({
	ColorPicker: ({ label }: { label: React.ReactNode }) => (
		<div data-testid="color-picker">{label}</div>
	),
}));

vi.mock("../forms/Input", () => ({
	Input: ({ name, onBlur }: { name: string; onBlur?: () => void }) => (
		<button type="button" data-testid={`input-${name}`} onClick={onBlur} />
	),
}));

vi.mock("../forms/Padding", () => ({
	Padding: ({ onBlur }: { onBlur?: () => void }) => (
		<button type="button" data-testid="padding" onClick={onBlur} />
	),
}));

vi.mock("../forms/Toggle", () => ({
	Toggle: ({ name, onBlur }: { name: string; onBlur?: () => void }) => (
		<button type="button" data-testid={`toggle-${name}`} onClick={onBlur} />
	),
}));

vi.mock("../Trans", () => ({
	Trans: ({ components }: { components: { a: React.ReactElement } }) => (
		<div data-testid="trans">
			{React.cloneElement(components.a, {}, "link-text")}
		</div>
	),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { Form } from "./Form";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Form", () => {
	beforeEach(() => {
		mockUsePageSettings.mockReturnValue({ backgroundColor: "#fff" });
		mockUseSetSidebarView.mockReturnValue(vi.fn());
	});

	it("renders inputs, toggle, padding, and color picker", () => {
		renderWithTheme(<Form errors={[]} />);

		expect(screen.getByTestId("input-from")).not.toBeNull();
		expect(screen.getByTestId("input-rowHeight")).not.toBeNull();
		expect(screen.getByTestId("input-cols")).not.toBeNull();
		expect(screen.getByTestId("toggle-stretchToAvailableWidth")).not.toBeNull();
		expect(screen.getByTestId("padding")).not.toBeNull();
		expect(screen.getByTestId("color-picker")).not.toBeNull();
	});

	it("does not render the clear breakpoint button when onClearBreakpoint is not provided", () => {
		renderWithTheme(<Form errors={[]} />);
		expect(screen.queryByTestId("remove-ghost")).toBeNull();
	});

	it("renders and triggers the clear breakpoint button when provided", () => {
		const onClearBreakpoint = vi.fn();
		renderWithTheme(<Form errors={[]} onClearBreakpoint={onClearBreakpoint} />);

		fireEvent.click(screen.getByTestId("remove-ghost"));
		expect(onClearBreakpoint).toHaveBeenCalled();
	});

	it("calls onSave when a field triggers onBlur", () => {
		const onSave = vi.fn();
		renderWithTheme(<Form errors={[]} onSave={onSave} />);

		fireEvent.click(screen.getByTestId("input-from"));
		fireEvent.click(screen.getByTestId("toggle-stretchToAvailableWidth"));
		fireEvent.click(screen.getByTestId("padding"));

		expect(onSave).toHaveBeenCalledTimes(3);
	});

	it("navigates to page settings when the trans link is clicked", () => {
		const setSidebarView = vi.fn();
		mockUseSetSidebarView.mockReturnValue(setSidebarView);

		renderWithTheme(<Form errors={[]} />);

		fireEvent.click(screen.getByText("link-text"));

		expect(setSidebarView).toHaveBeenCalled();
	});
});
