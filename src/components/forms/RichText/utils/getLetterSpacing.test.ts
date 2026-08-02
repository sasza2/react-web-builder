import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { DEFAULT_LETTER_SPACING } from "@/consts";

import { getLetterSpacing } from "./getLetterSpacing";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

describe("getLetterSpacing", () => {
	it("returns the default when there is no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = null;

		expect(getLetterSpacing(editor)).toBe(DEFAULT_LETTER_SPACING);
	});

	it("returns the paragraph's letterSpacing when set", () => {
		const editor = makeEditor([
			{ type: "paragraph", letterSpacing: "2.0px", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLetterSpacing(editor)).toBe("2.0px");
	});

	it("returns the default when the paragraph has no letterSpacing", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLetterSpacing(editor)).toBe(DEFAULT_LETTER_SPACING);
	});

	it("returns the default when the selected node is not a paragraph", () => {
		const editor = makeEditor([{ type: "heading", children: [{ text: "a" }] }]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLetterSpacing(editor)).toBe(DEFAULT_LETTER_SPACING);
	});
});
