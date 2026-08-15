import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";

import type { RootState } from "@/store/store";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseBreakpoint = vi.fn();
const mockUseConfiguration = vi.fn();
const mockUseClearBreakpoint = vi.fn();
const mockUseElements = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseRemoveBreakpoint = vi.fn();
const mockUseSetSidebarView = vi.fn();
const mockUseUpdateBreakpoint = vi.fn();
const mockUseAppSelector = vi.fn();
const mockUseValidateForm = vi.fn();
const mockGetFormValues = vi.fn();
const mockGetBreakpointBackgroundColor = vi.fn();
const mockGetBreakpointPadding = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
	withTranslation:
		() =>
		<Props,>(Component: Props) =>
			Component,
}));

vi.mock("@/components/Button", () => ({
	RemoveButton: ({
		children,
		onClick,
	}: React.PropsWithChildren<{ onClick: React.MouseEventHandler }>) => (
		<button type="button" data-testid="remove-button" onClick={onClick}>
			{children}
		</button>
	),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
	useBreakpoint: () => mockUseBreakpoint(),
}));

vi.mock("@/hooks/useClearBreakpoint", () => ({
	useClearBreakpoint: () => mockUseClearBreakpoint(),
}));

vi.mock("@/hooks/useElements", () => ({
	useElements: () => mockUseElements(),
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("@/hooks/useRemoveBreakpoint", () => ({
	useRemoveBreakpoint: () => mockUseRemoveBreakpoint(),
}));

vi.mock("@/hooks/useSetSidebarView", () => ({
	useSetSidebarView: () => mockUseSetSidebarView(),
}));

vi.mock("@/hooks/useUpdateBreakpoint", () => ({
	useUpdateBreakpoint: () => mockUseUpdateBreakpoint(),
}));

vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: RootState) => unknown) =>
		mockUseAppSelector(selector),
}));

vi.mock("@/utils/breakpoint", () => ({
	getBreakpointBackgroundColor: (...args: unknown[]) =>
		mockGetBreakpointBackgroundColor(...args),
	getBreakpointPadding: (...args: unknown[]) =>
		mockGetBreakpointPadding(...args),
}));

vi.mock("../ConfigurationProvider", () => ({
	useConfiguration: () => mockUseConfiguration(),
}));

vi.mock("../FormProvider", () => ({
	FormProvider: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
	useFormCreator: (init: () => unknown) => {
		mockGetFormValues.mockReturnValue(init());
		return { id: "form-1", getFormValues: mockGetFormValues, setForm: vi.fn() };
	},
}));

vi.mock("../forms/FormContainerDiv", () => ({
	FormContainerDiv: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
}));

vi.mock("../SidebarHeader", () => ({
	SidebarHeader: ({
		children,
		onBack,
	}: React.PropsWithChildren<{ onBack?: () => void }>) => (
		<div>
			{onBack && (
				<button type="button" data-testid="back-button" onClick={onBack} />
			)}
			{children}
		</div>
	),
}));

vi.mock("../SidebarProvider", () => ({
	SidebarView: { AddElement: "AddElement", PageSettings: "PageSettings" },
}));

vi.mock("../SidebarScrollbar", () => ({
	SidebarScrollbar: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
}));

vi.mock("./Form", () => ({
	Form: ({
		onSave,
		onClearBreakpoint,
	}: {
		onSave: () => void;
		onClearBreakpoint?: React.MouseEventHandler;
	}) => (
		<div>
			<button type="button" data-testid="form-save" onClick={onSave} />
			{onClearBreakpoint && (
				<button
					type="button"
					data-testid="form-clear"
					onClick={onClearBreakpoint as React.MouseEventHandler}
				/>
			)}
		</div>
	),
}));

vi.mock("./useValidateForm", () => ({
	useValidateForm: () => mockUseValidateForm(),
}));

import { EditBreakpoint } from "./EditBreakpoint";

describe("EditBreakpoint", () => {
	beforeEach(() => {
		vi.clearAllMocks();
		mockUseConfiguration.mockReturnValue({ autoSave: false });
		mockUseClearBreakpoint.mockReturnValue(vi.fn());
		mockUseElements.mockReturnValue({ elements: [] });
		mockUsePageSettings.mockReturnValue({ backgroundColor: null });
		mockUseRemoveBreakpoint.mockReturnValue(vi.fn());
		mockUseSetSidebarView.mockReturnValue(vi.fn());
		mockUseUpdateBreakpoint.mockReturnValue(vi.fn());
		mockUseAppSelector.mockReturnValue("undo-1");
		mockUseValidateForm.mockReturnValue([[], vi.fn().mockReturnValue([])]);
		mockGetBreakpointBackgroundColor.mockReturnValue("#abcdef");
		mockGetBreakpointPadding.mockReturnValue({
			top: 1,
			right: 1,
			bottom: 1,
			left: 1,
		});
	});

	it("renders null when there's no current breakpoint", () => {
		mockUseBreakpoint.mockReturnValue(null);

		const { container } = render(<EditBreakpoint />);

		expect(container.innerHTML).toBe("");
	});

	it("renders the edit form when a breakpoint is selected", () => {
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		expect(screen.getByText("breakpoint.edit")).not.toBeNull();
		expect(screen.getByTestId("remove-button")).not.toBeNull();
	});

	it("uses null backgroundColor in the form when breakpoint has none", () => {
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: null,
		});

		render(<EditBreakpoint />);

		expect(mockGetFormValues().backgroundColor).toBeNull();
		expect(mockGetBreakpointBackgroundColor).not.toHaveBeenCalled();
	});

	it("resolves backgroundColor via getBreakpointBackgroundColor when breakpoint has one", () => {
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: 900,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		expect(mockGetFormValues().backgroundColor).toBe("#abcdef");
		expect(mockGetFormValues().stretchToAvailableWidth).toBe(false);
	});

	it("falls back to null when getBreakpointBackgroundColor returns falsy", () => {
		mockGetBreakpointBackgroundColor.mockReturnValue(undefined);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: 900,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		expect(mockGetFormValues().backgroundColor).toBeNull();
	});

	it("calls updateBreakpoint on save when validation passes", () => {
		const updateBreakpoint = vi.fn();
		mockUseUpdateBreakpoint.mockReturnValue(updateBreakpoint);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("form-save"));

		expect(updateBreakpoint).toHaveBeenCalled();
	});

	it("does not call updateBreakpoint when validation fails", () => {
		const updateBreakpoint = vi.fn();
		mockUseUpdateBreakpoint.mockReturnValue(updateBreakpoint);
		mockUseValidateForm.mockReturnValue([
			[],
			vi.fn().mockReturnValue([{ name: "from", error: "bad" }]),
		]);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("form-save"));

		expect(updateBreakpoint).not.toHaveBeenCalled();
	});

	it("does not show the clear-breakpoint action when there are no elements", () => {
		mockUseElements.mockReturnValue({ elements: [] });
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		expect(screen.queryByTestId("form-clear")).toBeNull();
	});

	it("clears the breakpoint without confirmation when autoSave is off", () => {
		const clearBreakpoint = vi.fn();
		mockUseClearBreakpoint.mockReturnValue(clearBreakpoint);
		mockUseElements.mockReturnValue({ elements: [{ id: "e1" }] });
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("form-clear"));

		expect(clearBreakpoint).toHaveBeenCalled();
	});

	it("asks for confirmation before clearing when autoSave is on, and respects cancellation", () => {
		mockUseConfiguration.mockReturnValue({ autoSave: true });
		const clearBreakpoint = vi.fn();
		mockUseClearBreakpoint.mockReturnValue(clearBreakpoint);
		mockUseElements.mockReturnValue({ elements: [{ id: "e1" }] });
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("form-clear"));

		expect(clearBreakpoint).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it("clears the breakpoint when confirmed with autoSave on", () => {
		mockUseConfiguration.mockReturnValue({ autoSave: true });
		const clearBreakpoint = vi.fn();
		mockUseClearBreakpoint.mockReturnValue(clearBreakpoint);
		mockUseElements.mockReturnValue({ elements: [{ id: "e1" }] });
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("form-clear"));

		expect(clearBreakpoint).toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it("removes the breakpoint without confirmation when autoSave is off", () => {
		const removeBreakpoint = vi.fn();
		mockUseRemoveBreakpoint.mockReturnValue(removeBreakpoint);
		const breakpoint: {
			id: string;
			from: number;
			to: number | null;
			rowHeight: number;
			cols: number;
			backgroundColor: string;
		} = {
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		};
		mockUseBreakpoint.mockReturnValue(breakpoint);

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("remove-button"));

		expect(removeBreakpoint).toHaveBeenCalledWith(breakpoint);
	});

	it("removes the breakpoint after confirmation when autoSave is on", () => {
		mockUseConfiguration.mockReturnValue({ autoSave: true });
		const removeBreakpoint = vi.fn();
		mockUseRemoveBreakpoint.mockReturnValue(removeBreakpoint);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(true);

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("remove-button"));

		expect(removeBreakpoint).toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it("does not remove the breakpoint when confirmation is cancelled", () => {
		mockUseConfiguration.mockReturnValue({ autoSave: true });
		const removeBreakpoint = vi.fn();
		mockUseRemoveBreakpoint.mockReturnValue(removeBreakpoint);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});
		const confirmSpy = vi.spyOn(window, "confirm").mockReturnValue(false);

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("remove-button"));

		expect(removeBreakpoint).not.toHaveBeenCalled();

		confirmSpy.mockRestore();
	});

	it("navigates back to AddElement view via SidebarHeader onBack", () => {
		const setSidebarView = vi.fn();
		mockUseSetSidebarView.mockReturnValue(setSidebarView);
		mockUseBreakpoint.mockReturnValue({
			id: "bp1",
			from: 500,
			to: null,
			rowHeight: 15,
			cols: 10,
			backgroundColor: "#fff",
		});

		render(<EditBreakpoint />);

		fireEvent.click(screen.getByTestId("back-button"));

		expect(setSidebarView).toHaveBeenCalledWith("AddElement");
	});
});
