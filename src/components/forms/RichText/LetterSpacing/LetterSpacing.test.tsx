import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

const mockGetLetterSpacing = vi.fn();
vi.mock("../utils/getLetterSpacing", () => ({
	getLetterSpacing: (...args: unknown[]) => mockGetLetterSpacing(...args),
}));

const mockToggleLetterSpacing = vi.fn();
vi.mock("../utils/toggleLetterSpacing", () => ({
	toggleLetterSpacing: (...args: unknown[]) => mockToggleLetterSpacing(...args),
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
					onClick={() => setValue("2.0px")}
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
	IconMock.LetterSpacing = "LetterSpacing";
	return { Icon: IconMock };
});

import { StyleProvider } from "@/components/StyleProvider";

import { LETTER_SPACINGS, LetterSpacingSelect } from "./LetterSpacing";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("LetterSpacingSelect", () => {
	it("builds the LETTER_SPACINGS list with a leading '-'/normal entry", () => {
		expect(LETTER_SPACINGS[0]).toEqual({ label: "-", value: "normal" });
		expect(LETTER_SPACINGS.length).toBeGreaterThan(1);
		expect(LETTER_SPACINGS[1]).toEqual({ label: "0.0", value: "0.0px" });
	});

	it("renders the select bound to the current letter spacing and the icon", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetLetterSpacing.mockReturnValue("normal");

		renderWithTheme(<LetterSpacingSelect />);

		expect(screen.getByTestId("select-letterSpacing").textContent).toBe(
			"normal",
		);
		expect(screen.getByTestId("icon")).not.toBeNull();
	});

	it("calls toggleLetterSpacing with the editor when a value is chosen", () => {
		mockUseSlate.mockReturnValue({ id: "editor" });
		mockGetLetterSpacing.mockReturnValue("normal");

		renderWithTheme(<LetterSpacingSelect />);

		fireEvent.click(screen.getByTestId("select-letterSpacing"));

		expect(mockToggleLetterSpacing).toHaveBeenCalledWith(
			{ id: "editor" },
			"2.0px",
		);
	});
});
