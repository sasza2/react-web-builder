import { createEditor, type Editor } from "slate";
import { describe, expect, it, vi } from "vitest";

const mockFocus = vi.fn();
vi.mock("slate-react", () => ({
	ReactEditor: {
		focus: (...args: unknown[]) => mockFocus(...args),
	},
}));

import theme from "@/components/StyleProvider/theme";

import {
	getColorActive,
	isColorActive,
	isMarkActive,
	TEXT_ALIGN_TYPES,
	toggleBlock,
	toggleColor,
	toggleMark,
} from "./index";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

function selectFirstText() {
	return {
		anchor: { path: [0, 0], offset: 0 },
		focus: { path: [0, 0], offset: 1 },
	};
}

describe("RichText utils index", () => {
	beforeEach(() => {
		mockFocus.mockClear();
	});

	it("TEXT_ALIGN_TYPES lists the four alignments", () => {
		expect(TEXT_ALIGN_TYPES).toEqual(["left", "center", "right", "justify"]);
	});

	describe("toggleBlock", () => {
		it("sets the align property for align formats", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleBlock(editor, "center");

			expect((editor.children[0] as { align?: string }).align).toBe("center");
		});

		it("unsets the align property when toggling an already-active align format", () => {
			const editor = makeEditor([
				{ type: "paragraph", align: "center", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleBlock(editor, "center");

			expect((editor.children[0] as { align?: string }).align).toBeUndefined();
		});

		it("sets the block type for non-align, non-list formats", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleBlock(editor, "block-quote");

			expect((editor.children[0] as { type: string }).type).toBe("block-quote");
		});

		it("toggling an already-active block type reverts it to paragraph", () => {
			const editor = makeEditor([
				{ type: "block-quote", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleBlock(editor, "block-quote");

			expect((editor.children[0] as { type: string }).type).toBe("paragraph");
		});

		it("wraps in a list node and marks children as list-item for list formats", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleBlock(editor, "bulleted-list");

			const wrapped = editor.children[0] as {
				type: string;
				children: { type: string }[];
			};
			expect(wrapped.type).toBe("bulleted-list");
			expect(wrapped.children[0].type).toBe("list-item");
		});
	});

	describe("isMarkActive/toggleMark", () => {
		it("is false without marks and true after toggling on", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			expect(isMarkActive(editor, "bold")).toBe(false);

			toggleMark(editor, "bold");

			expect(mockFocus).toHaveBeenCalledWith(editor);
			expect(isMarkActive(editor, "bold")).toBe(true);
		});

		it("toggles the mark back off", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleMark(editor, "bold");
			toggleMark(editor, "bold");

			expect(isMarkActive(editor, "bold")).toBe(false);
		});
	});

	describe("isColorActive/toggleColor/getColorActive", () => {
		it("defaults to black when there is no color mark", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			expect(isColorActive(editor, theme.colors.black)).toBe(false);
			expect(getColorActive(editor)).toBe(theme.colors.black);
		});

		it("toggleColor sets the color mark, defaulting to black", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleColor(editor);

			expect(isColorActive(editor, theme.colors.black)).toBe(true);
			expect(getColorActive(editor)).toBe(theme.colors.black);
		});

		it("toggleColor sets a custom color", () => {
			const editor = makeEditor([
				{ type: "paragraph", children: [{ text: "a" }] },
			]);
			editor.selection = selectFirstText();

			toggleColor(editor, "#ff0000");

			expect(getColorActive(editor)).toBe("#ff0000");
		});
	});
});
