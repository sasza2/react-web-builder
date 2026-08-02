import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { isBlockActive } from "./isBlockActive";

function makeEditor(children: unknown[]): Editor {
	const editor = createEditor();
	editor.children = children as never;
	return editor;
}

describe("isBlockActive", () => {
	it("returns false when there is no selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", align: "left", children: [{ text: "a" }] },
		]);
		editor.selection = null;

		expect(isBlockActive(editor, "left", "align")).toBe(false);
	});

	it("returns true when the matching block/format is at the selection", () => {
		const editor = makeEditor([
			{ type: "paragraph", align: "left", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(isBlockActive(editor, "left", "align")).toBe(true);
		expect(isBlockActive(editor, "right", "align")).toBe(false);
	});

	it("matches on the type property", () => {
		const editor = makeEditor([
			{ type: "bulleted-list", children: [{ text: "a" }] },
		]);
		editor.selection = {
			anchor: { path: [0, 0], offset: 0 },
			focus: { path: [0, 0], offset: 1 },
		};

		expect(isBlockActive(editor, "bulleted-list", "type")).toBe(true);
	});
});
