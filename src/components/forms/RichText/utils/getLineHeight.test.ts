import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { DEFAULT_LINE_HEIGHT } from "@/consts";

import { getLineHeight } from "./getLineHeight";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

describe("getLineHeight", () => {
	it("returns the default when there is no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = null;

		expect(getLineHeight(editor)).toBe(DEFAULT_LINE_HEIGHT);
	});

	it("returns the paragraph's lineHeight when set", () => {
		const editor = makeEditor([
			{ type: "paragraph", lineHeight: "2.0", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLineHeight(editor)).toBe("2.0");
	});

	it("returns the default when the paragraph has no lineHeight", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLineHeight(editor)).toBe(DEFAULT_LINE_HEIGHT);
	});

	it("returns the default when the selected node is not a paragraph", () => {
		const editor = makeEditor([{ type: "heading", children: [{ text: "a" }] }]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(getLineHeight(editor)).toBe(DEFAULT_LINE_HEIGHT);
	});
});
