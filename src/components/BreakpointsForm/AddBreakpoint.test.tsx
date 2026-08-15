import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, it, vi } from "vitest";

const mockUseAddBreakpoint = vi.fn();
const mockUsePageSettings = vi.fn();
const mockUseValidateForm = vi.fn();
const mockGetFormValues = vi.fn();

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("styled-components", async () => {
	const actual = await vi.importActual("styled-components");
	return {
		...actual,
		useTheme: () => ({ colors: { white: "#ffffff" } }),
	};
});

vi.mock("@/components/Button", () => ({
	ConfirmButton: ({
		children,
		onClick,
		testId,
	}: React.PropsWithChildren<{
		onClick: React.MouseEventHandler;
		testId?: string;
	}>) => (
		<button type="button" data-testid={testId} onClick={onClick}>
			{children}
		</button>
	),
}));

vi.mock("@/hooks/useAddBreakpoint", () => ({
	useAddBreakpoint: () => mockUseAddBreakpoint(),
}));

vi.mock("@/hooks/usePageSettings", () => ({
	usePageSettings: () => mockUsePageSettings(),
}));

vi.mock("../FormProvider/FormProvider", () => ({
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
	SidebarHeader: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
}));

vi.mock("../SidebarScrollbar", () => ({
	SidebarScrollbar: ({ children }: React.PropsWithChildren) => (
		<div>{children}</div>
	),
}));

vi.mock("./Form", () => ({
	Form: ({ onSave }: { onSave: () => void }) => (
		<button type="button" data-testid="form-save" onClick={onSave} />
	),
}));

vi.mock("./useValidateForm", () => ({
	useValidateForm: () => mockUseValidateForm(),
}));

import { AddBreakpoint } from "./AddBreakpoint";

describe("AddBreakpoint", () => {
	beforeEach(() => {
		mockUsePageSettings.mockReturnValue({ backgroundColor: null });
		mockUseAddBreakpoint.mockReturnValue(vi.fn());
	});

	it("renders header and save button", () => {
		mockUseValidateForm.mockReturnValue([[], vi.fn().mockReturnValue([])]);

		render(<AddBreakpoint />);

		expect(screen.getAllByText("breakpoint.add").length).toBeGreaterThan(0);
		expect(screen.getByTestId("breakpointAddButton")).not.toBeNull();
	});

	it("uses page settings backgroundColor when present, else theme default", () => {
		mockUsePageSettings.mockReturnValue({ backgroundColor: "#123456" });
		mockUseValidateForm.mockReturnValue([[], vi.fn().mockReturnValue([])]);

		render(<AddBreakpoint />);

		expect(mockGetFormValues().backgroundColor).toBe("#123456");
	});

	it("validates on form save (blur)", () => {
		const validateForm = vi.fn().mockReturnValue([]);
		mockUseValidateForm.mockReturnValue([[], validateForm]);

		render(<AddBreakpoint />);

		fireEvent.click(screen.getByTestId("form-save"));

		expect(validateForm).toHaveBeenCalled();
	});

	it("does not call add() when validation fails on button click", () => {
		const add = vi.fn();
		mockUseAddBreakpoint.mockReturnValue(add);
		const validateForm = vi
			.fn()
			.mockReturnValue([{ name: "from", error: "bad" }]);
		mockUseValidateForm.mockReturnValue([[], validateForm]);

		render(<AddBreakpoint />);

		fireEvent.click(screen.getByTestId("breakpointAddButton"));

		expect(add).not.toHaveBeenCalled();
	});

	it("calls add() with the converted breakpoint when validation passes", () => {
		const add = vi.fn();
		mockUseAddBreakpoint.mockReturnValue(add);
		const validateForm = vi.fn().mockReturnValue([]);
		mockUseValidateForm.mockReturnValue([[], validateForm]);

		render(<AddBreakpoint />);

		fireEvent.click(screen.getByTestId("breakpointAddButton"));

		expect(add).toHaveBeenCalled();
	});
});
