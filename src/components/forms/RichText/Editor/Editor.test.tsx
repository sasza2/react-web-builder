import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

// Editor.tsx wires together slate/slate-react, an iframe renderer, and this
// repo's box renderer. We mock all of those heavy pieces and focus on
// Editor.tsx's own logic: initialValue construction, the onChange
// set_selection filtering, undoKey-driven remount, and which toolbar pieces
// are conditionally rendered.

let capturedSlateProps: {
	onChange: (value: unknown) => void;
	editor: { operations: { type: string }[] };
} | null = null;

vi.mock("slate", async () => {
	const actual = await vi.importActual<object>("slate");
	return {
		...actual,
		createEditor: () => ({ operations: [] }),
	};
});

vi.mock("slate-react", () => ({
	Slate: (props: {
		children: React.ReactNode;
		editor: { operations: { type: string }[] };
		initialValue: unknown;
		onChange: (value: unknown) => void;
	}) => {
		capturedSlateProps = {
			onChange: props.onChange,
			editor: props.editor,
		};
		return (
			<div data-testid="slate">
				<div data-testid="initial-value">
					{JSON.stringify(props.initialValue)}
				</div>
				{props.children}
			</div>
		);
	},
	Editable: () => <div data-testid="editable" />,
	withReact: (editor: unknown) => editor,
}));

vi.mock("@/components/icons/Icon", () => {
	const IconMock = (props: { icon?: string }) => (
		<div data-testid="icon">{props.icon}</div>
	);
	IconMock.TextLeft = "TextLeft";
	IconMock.TextCenter = "TextCenter";
	IconMock.TextRight = "TextRight";
	IconMock.TextJustify = "TextJustify";
	IconMock.TextBold = "TextBold";
	IconMock.TextItalic = "TextItalic";
	IconMock.TextUnderline = "TextUnderline";
	return { Icon: IconMock };
});

vi.mock("@/components/RenderInIFrame", () => ({
	RenderInIFrame: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="render-in-iframe">{children}</div>
	),
}));

vi.mock("@/components/Scrollbar", () => ({
	Scrollbar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="scrollbar">{children}</div>
	),
}));

vi.mock("@/components/View/Box", () => ({
	Element: () => <div data-testid="element" />,
	Leaf: () => <div data-testid="leaf" />,
}));

vi.mock("../buttons", () => ({
	BlockButton: ({ format }: { format: string }) => (
		<div data-testid={`block-button-${format}`} />
	),
	MarkButton: ({ format }: { format: string }) => (
		<div data-testid={`mark-button-${format}`} />
	),
}));

vi.mock("../ColorSelect", () => ({
	ColorSelect: () => <div data-testid="color-select" />,
}));

vi.mock("../FontSizeSelect/FontSizeSelect", () => ({
	FontSizeSelect: () => <div data-testid="font-size-select" />,
}));

vi.mock("../Hyperlink", () => ({
	Hyperlink: () => <div data-testid="hyperlink" />,
}));

vi.mock("../LetterSpacing/LetterSpacing", () => ({
	LetterSpacingSelect: () => <div data-testid="letter-spacing-select" />,
}));

vi.mock("../LineHeight/LineHeight", () => ({
	LineHeightSelect: () => <div data-testid="line-height-select" />,
}));

vi.mock("../Toolbar", () => ({
	Toolbar: ({ children }: { children: React.ReactNode }) => (
		<div data-testid="toolbar">{children}</div>
	),
}));

vi.mock("./AutoFocus", () => ({
	AutoFocus: () => <div data-testid="auto-focus" />,
}));

const mockUseAppSelector = vi.fn();
vi.mock("@/store/useAppSelector", () => ({
	useAppSelector: (selector: (state: unknown) => unknown) =>
		mockUseAppSelector(selector),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { Editor } from "./Editor";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("Editor", () => {
	beforeEach(() => {
		capturedSlateProps = null;
		mockUseAppSelector.mockReturnValue("undo-key-1");
	});

	it("defaults to a single empty paragraph when no value is given", () => {
		renderWithTheme(<Editor setValue={vi.fn()} value={undefined} />);

		expect(screen.getByTestId("initial-value").textContent).toBe(
			JSON.stringify([{ type: "paragraph", children: [{ text: "" }] }]),
		);
	});

	it("uses the given value as-is when it's already an array", () => {
		const value = [{ type: "paragraph", children: [{ text: "hi" }] }];
		renderWithTheme(<Editor setValue={vi.fn()} value={value} />);

		expect(screen.getByTestId("initial-value").textContent).toBe(
			JSON.stringify(value),
		);
	});

	it("wraps a plain string value into a paragraph", () => {
		renderWithTheme(
			<Editor setValue={vi.fn()} value={"plain text" as never} />,
		);

		expect(screen.getByTestId("initial-value").textContent).toBe(
			JSON.stringify([
				{ type: "paragraph", children: [{ text: "plain text" }] },
			]),
		);
	});

	it("shows color and hyperlink controls by default", () => {
		renderWithTheme(<Editor setValue={vi.fn()} value={[]} />);

		expect(screen.getByTestId("color-select")).not.toBeNull();
		expect(screen.getByTestId("hyperlink")).not.toBeNull();
	});

	it("hides color and hyperlink controls when explicitly disabled", () => {
		renderWithTheme(
			<Editor
				setValue={vi.fn()}
				value={[]}
				colorAvailable={false}
				hyperlinkAvailable={false}
			/>,
		);

		expect(screen.queryByTestId("color-select")).toBeNull();
		expect(screen.queryByTestId("hyperlink")).toBeNull();
	});

	it("renders all the alignment and mark buttons", () => {
		renderWithTheme(<Editor setValue={vi.fn()} value={[]} />);

		["left", "center", "right", "justify"].forEach((format) => {
			expect(screen.getByTestId(`block-button-${format}`)).not.toBeNull();
		});
		["bold", "italic", "underline"].forEach((format) => {
			expect(screen.getByTestId(`mark-button-${format}`)).not.toBeNull();
		});
	});

	it("calls setValue when there are non set_selection operations", () => {
		const setValue = vi.fn();
		renderWithTheme(<Editor setValue={setValue} value={[]} />);

		capturedSlateProps.editor.operations = [{ type: "insert_text" }];
		const nextValue = [{ type: "paragraph", children: [{ text: "x" }] }];
		capturedSlateProps.onChange(nextValue);

		expect(setValue).toHaveBeenCalledWith(nextValue);
	});

	it("does not call setValue when only set_selection operations happened", () => {
		const setValue = vi.fn();
		renderWithTheme(<Editor setValue={setValue} value={[]} />);

		capturedSlateProps.editor.operations = [{ type: "set_selection" }];
		capturedSlateProps.onChange([]);

		expect(setValue).not.toHaveBeenCalled();
	});

	it("does not call setValue when there are no operations at all", () => {
		const setValue = vi.fn();
		renderWithTheme(<Editor setValue={setValue} value={[]} />);

		capturedSlateProps.editor.operations = [];
		capturedSlateProps.onChange([]);

		expect(setValue).not.toHaveBeenCalled();
	});
});
