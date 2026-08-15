import { createEditor, type Editor } from "slate";
import { describe, expect, it } from "vitest";

import { getFontSizeActive, isFontSizeActive, toggleFontSize } from "./font";

function makeEditor(): Editor {
	const editor = createEditor();
	editor.children = [
		{ type: "paragraph", children: [{ text: "hello" }] },
	] as never;
	editor.selection = {
		anchor: { path: [0, 0], offset: 0 },
		focus: { path: [0, 0], offset: 5 },
	};
	return editor;
}

describe("font utils", () => {
	it("isFontSizeActive is false when there are no marks", () => {
		const editor = makeEditor();
		expect(isFontSizeActive(editor, 12)).toBe(false);
	});

	it("getFontSizeActive defaults to 12 when there are no marks", () => {
		const editor = makeEditor();
		expect(getFontSizeActive(editor)).toBe(12);
	});

	it("toggleFontSize adds the mark when not active", () => {
		const editor = makeEditor();
		toggleFontSize(editor, 18);
		expect(isFontSizeActive(editor, 18)).toBe(true);
		expect(getFontSizeActive(editor)).toBe(18);
	});

	it("toggleFontSize removes the mark when already active", () => {
		const editor = makeEditor();
		toggleFontSize(editor, 18);
		toggleFontSize(editor, 18);
		expect(isFontSizeActive(editor, 18)).toBe(false);
	});

	it("toggleFontSize defaults to 12 when called without a size", () => {
		const editor = makeEditor();
		toggleFontSize(editor);
		expect(isFontSizeActive(editor, 12)).toBe(true);
	});
});
