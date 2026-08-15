import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

vi.mock("react-i18next", () => ({
	useTranslation: () => ({ t: (key: string) => key }),
}));

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

const mockGetLinkActive = vi.fn();
const mockIsHyperlinkActive = vi.fn();
const mockSetLink = vi.fn();
vi.mock("../utils/hyperlink", () => ({
	getLinkActive: (...args: unknown[]) => mockGetLinkActive(...args),
	isHyperlinkActive: (...args: unknown[]) => mockIsHyperlinkActive(...args),
	setLink: (...args: unknown[]) => mockSetLink(...args),
}));

const mockClose = vi.fn();
const mockOnOpen = vi.fn();
vi.mock("../FieldPopup", () => ({
	usePopup: () => ({
		buttonRef: { current: null },
		close: mockClose,
		closing: false,
		onOpen: mockOnOpen,
		popupRef: { current: null },
		position: { top: 1, left: 2 },
		setPosition: vi.fn(),
	}),
	FieldPopup: ({ children }: { children?: React.ReactNode }) => (
		<div data-testid="field-popup">{children}</div>
	),
}));

vi.mock("../../Input", async () => {
	const { useField } = await vi.importActual<
		typeof import("@/components/FormProvider")
	>("@/components/FormProvider");
	return {
		Input: ({
			name,
			onBlur,
		}: {
			name: string;
			onBlur?: (v: string) => void;
		}) => {
			const { setValue, value } = useField(name);
			return (
				<input
					data-testid={`input-${name}`}
					value={String(value ?? "")}
					onChange={(e) => setValue(e.target.value)}
					onBlur={(e) => onBlur?.(e.target.value)}
				/>
			);
		},
	};
});

import { StyleProvider } from "@/components/StyleProvider";

import { Hyperlink } from "./Hyperlink";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Hyperlink", () => {
	const editor = { id: "editor" };

	beforeEach(() => {
		mockUseSlate.mockReturnValue(editor);
		mockGetLinkActive.mockReturnValue("https://example.com");
		mockIsHyperlinkActive.mockReturnValue(true);
		mockSetLink.mockClear();
		mockClose.mockClear();
	});

	it("renders the field popup bound to the current link", () => {
		renderWithTheme(<Hyperlink />);

		expect(screen.getByTestId("field-popup")).not.toBeNull();
		expect((screen.getByTestId("input-link") as HTMLInputElement).value).toBe(
			"https://example.com",
		);
	});

	it("setLink is called and the popup closes on blur", () => {
		renderWithTheme(<Hyperlink />);

		fireEvent.blur(screen.getByTestId("input-link"), {
			target: { value: "https://new.example.com" },
		});

		expect(mockSetLink).toHaveBeenCalledWith(editor, "https://new.example.com");
		expect(mockClose).toHaveBeenCalled();
	});
});
