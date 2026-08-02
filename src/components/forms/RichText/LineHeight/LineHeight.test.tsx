import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

const mockGetLineHeight = vi.fn();
vi.mock("../utils/getLineHeight", () => ({
	getLineHeight: (...args: unknown[]) => mockGetLineHeight(...args),
}));

const mockToggleLineHeight = vi.fn();
vi.mock("../utils/toggleLineHeight", () => ({
	toggleLineHeight: (...args: unknown[]) => mockToggleLineHeight(...args),
}));

vi.mock("../../Select", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		Select: ({ name }: { name: string }) => {
			const { setValue, value } = useField(name);
			return (
				<button
					type="button"
					data-testid={`select-${name}`}
					onClick={() => setValue("2.0")}
				>
					{String(value)}
				</button>
			);
		},
	};
});

vi.mock("@/components/icons/Icon", () => {
	const IconMock = (props: { icon?: string }) => (
		<div data-testid="icon">{props.icon}</div>
	);
	IconMock.LineHeight = "LineHeight";
	return { Icon: IconMock };
});

import { StyleProvider } from "@/components/StyleProvider";

import { LINE_HEIGHTS, LineHeightSelect } from "./LineHeight";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("LineHeightSelect", () => {
	it("builds LINE_HEIGHTS from 0.8 to 2.0", () => {
		expect(LINE_HEIGHTS[0]).toEqual({ label: "0.8", value: "0.8" });
		expect(LINE_HEIGHTS[LINE_HEIGHTS.length - 1]).toEqual({
			label: "2.0",
			value: "2.0",
		});
	});

	it("renders the select bound to the current line height and the icon", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetLineHeight.mockReturnValue("1.5");

		renderWithTheme(<LineHeightSelect />);

		expect(screen.getByTestId("select-lineHeight").textContent).toBe("1.5");
		expect(screen.getByTestId("icon")).not.toBeNull();
	});

	it("calls toggleLineHeight with the editor when a value is chosen", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetLineHeight.mockReturnValue("1.5");

		renderWithTheme(<LineHeightSelect />);

		fireEvent.click(screen.getByTestId("select-lineHeight"));

		expect(mockToggleLineHeight).toHaveBeenCalledWith({ id: "editor" }, "2.0");
	});
});
