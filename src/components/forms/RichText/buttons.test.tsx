import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, it, vi } from "vitest";

const mockUseSlate = vi.fn();
vi.mock("slate-react", () => ({
	useSlate: () => mockUseSlate(),
}));

const mockIsBlockActive = vi.fn();
vi.mock("./utils/isBlockActive", () => ({
	isBlockActive: (...args: unknown[]) => mockIsBlockActive(...args),
}));

const mockIsMarkActive = vi.fn();
const mockToggleBlock = vi.fn();
const mockToggleMark = vi.fn();
vi.mock("./utils", () => ({
	isMarkActive: (...args: unknown[]) => mockIsMarkActive(...args),
	TEXT_ALIGN_TYPES: ["left", "center", "right", "justify"],
	toggleBlock: (...args: unknown[]) => mockToggleBlock(...args),
	toggleMark: (...args: unknown[]) => mockToggleMark(...args),
}));

import { StyleProvider } from "@/components/StyleProvider";

import { BlockButton, Button, Icon, MarkButton } from "./buttons";

const renderWithTheme = (ui: React.ReactElement) =>
	render(<StyleProvider>{ui}</StyleProvider>);

describe("RichText buttons", () => {
	const editor = { id: "editor" };

	beforeEach(() => {
		mockUseSlate.mockReturnValue(editor);
		mockIsBlockActive.mockReturnValue(false);
		mockIsMarkActive.mockReturnValue(false);
	});

	it("Icon renders children with forwarded ref", () => {
		const ref = React.createRef<HTMLSpanElement>();
		render(
			<Icon className="c" ref={ref}>
				content
			</Icon>,
		);
		expect(screen.getByText("content")).not.toBeNull();
		expect(ref.current).not.toBeNull();
	});

	it("Button renders the icon prop", () => {
		renderWithTheme(
			<Button
				className="c"
				active={false}
				reversed={false}
				icon={<span>ico</span>}
			/>,
		);
		expect(screen.getByText("ico")).not.toBeNull();
	});

	it("BlockButton uses TEXT_ALIGN_TYPES to pick 'align' vs 'type' and toggles on mousedown", () => {
		const { container } = renderWithTheme(
			<BlockButton format="left" icon={<span>L</span>} />,
		);

		expect(mockIsBlockActive).toHaveBeenCalledWith(editor, "left", "align");

		fireEvent.mouseDown(container.querySelector("div"));

		expect(mockToggleBlock).toHaveBeenCalledWith(editor, "left");
	});

	it("BlockButton uses 'type' for non-align formats", () => {
		renderWithTheme(<BlockButton format="block-quote" icon={<span>Q</span>} />);

		expect(mockIsBlockActive).toHaveBeenCalledWith(
			editor,
			"block-quote",
			"type",
		);
	});

	it("MarkButton toggles the mark on mousedown and supports testId", () => {
		const { container } = renderWithTheme(
			<MarkButton format="bold" icon={<span>B</span>} testId="bold" />,
		);

		expect(mockIsMarkActive).toHaveBeenCalledWith(editor, "bold");
		expect(container.querySelector('[data-testid="bold"]')).not.toBeNull();

		fireEvent.mouseDown(container.querySelector('[data-testid="bold"]'));

		expect(mockToggleMark).toHaveBeenCalledWith(editor, "bold");
	});
});
