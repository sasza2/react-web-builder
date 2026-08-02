import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

const mockGetFontSizeActive = vi.fn();
const mockToggleFontSize = vi.fn();
vi.mock("../utils/font", () => ({
	getFontSizeActive: (...args: unknown[]) => mockGetFontSizeActive(...args),
	toggleFontSize: (...args: unknown[]) => mockToggleFontSize(...args),
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
					onClick={() => setValue(24)}
				>
					{String(value)}
				</button>
			);
		},
	};
});

import { FONT_SIZES, FontSizeSelect } from "./FontSizeSelect";

describe("FontSizeSelect", () => {
	it("has 15 predefined font sizes", () => {
		expect(FONT_SIZES.length).toBe(15);
		expect(FONT_SIZES[0]).toEqual({ label: "8 px", value: 8 });
	});

	it("renders a select bound to the active font size", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetFontSizeActive.mockReturnValue(16);

		render(<FontSizeSelect />);

		expect(screen.getByTestId("select-fontSize").textContent).toBe("16");
	});

	it("calls toggleFontSize with the editor when a size is chosen", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetFontSizeActive.mockReturnValue(16);

		render(<FontSizeSelect />);

		fireEvent.click(screen.getByTestId("select-fontSize"));

		expect(mockToggleFontSize).toHaveBeenCalledWith({ id: "editor" }, 24);
	});
});
