import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("i18next", () => ({
	t: (key: string) => key,
}));

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

vi.mock("@/components/RenderInSidebarModal", () => ({
	RenderInSidebarModal: ({
		children,
		open,
	}: {
		children?: React.ReactNode;
		open: boolean;
	}) => (open ? <div data-testid="sidebar-modal">{children}</div> : null),
}));

vi.mock("../../ColorPicker", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		ColorPicker: ({ name }: { name: string }) => {
			const { setValue } = useField(name);
			return (
				<button
					type="button"
					data-testid={`color-picker-${name}`}
					onClick={() => setValue("#ff0000")}
				>
					color-picker
				</button>
			);
		},
	};
});

const mockGetColorActive = vi.fn();
const mockToggleColor = vi.fn();
vi.mock("../utils", () => ({
	getColorActive: (...args: unknown[]) => mockGetColorActive(...args),
	toggleColor: (...args: unknown[]) => mockToggleColor(...args),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { ColorSelect } from "./ColorSelect";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("ColorSelect", () => {
	const editor = { id: "editor" };

	beforeEach(() => {
		mockUseSlate.mockReturnValue(editor);
		mockGetColorActive.mockReturnValue("#000000");
	});

	it("renders closed by default", () => {
		renderWithTheme(<ColorSelect />);
		expect(screen.queryByTestId("sidebar-modal")).toBeNull();
	});

	it("opens the color picker modal on click", () => {
		const { container } = renderWithTheme(<ColorSelect />);

		fireEvent.click(container.querySelector("div[class] > div"));

		expect(screen.getByTestId("sidebar-modal")).not.toBeNull();
		expect(screen.getByTestId("color-picker-color")).not.toBeNull();
		expect(screen.getByText("color.font")).not.toBeNull();
	});

	it("calls toggleColor with the editor when a color is picked", () => {
		renderWithTheme(<ColorSelect />);

		fireEvent.click(document.querySelector("div[class] > div"));
		fireEvent.click(screen.getByTestId("color-picker-color"));

		expect(mockToggleColor).toHaveBeenCalledWith(editor, "#ff0000");
	});
});
