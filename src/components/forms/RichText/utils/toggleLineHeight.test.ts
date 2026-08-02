import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { toggleLineHeight } from "./toggleLineHeight";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

describe("toggleLineHeight", () => {
	it("returns false and does nothing when there is no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = null;

		expect(toggleLineHeight(editor, "2.0")).toBe(false);
		expect(
			(editor.children[0] as { lineHeight?: string }).lineHeight,
		).toBeUndefined();
	});

	it("sets the lineHeight and type on the selected node", () => {
		const editor = makeEditor([
			{ type: "paragraph", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		toggleLineHeight(editor, "1.8");

		expect((editor.children[0] as { lineHeight?: string }).lineHeight).toBe(
			"1.8",
		);
	});
});
