import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { toggleLetterSpacing } from "./toggleLetterSpacing";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

describe("toggleLetterSpacing", () => {
	it("returns false and does nothing when there is no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = null;

		expect(toggleLetterSpacing(editor, "2.0px")).toBe(false);
		expect(
			(editor.children[0] as { letterSpacing?: string }).letterSpacing,
		).toBeUndefined();
	});

	it("sets the letterSpacing and type on the selected node", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		toggleLetterSpacing(editor, "3.0px");

		expect(
			(editor.children[0] as { letterSpacing?: string }).letterSpacing,
		).toBe("3.0px");
	});
});
