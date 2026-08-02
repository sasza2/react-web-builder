import { createEditor, type Editor } from "slate";
import { describe, expect, it, vi } from "vitest";

const mockFocus = vi.fn();
vi.mock("slate-react", () => ({
	ReactEditor: {
		focus: (...args: unknown[]) => mockFocus(...args),
	},
}));

import {
	getLinkActive,
	getOpenInNewTabActive,
	isHyperlinkActive,
	setLink,
	setOpenInNewTab,
} from "./hyperlink";

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

describe("hyperlink utils", () => {
	beforeEach(() => {
		mockFocus.mockClear();
	});

	it("isHyperlinkActive/getLinkActive/getOpenInNewTabActive default when no marks", () => {
		const editor = makeEditor();
		expect(isHyperlinkActive(editor)).toBe(false);
		expect(getLinkActive(editor)).toBe("");
		expect(getOpenInNewTabActive(editor)).toBe(false);
	});

	it("setOpenInNewTab adds the mark when true", () => {
		const editor = makeEditor();
		setOpenInNewTab(editor, true);

		expect(mockFocus).toHaveBeenCalledWith(editor);
		expect(getOpenInNewTabActive(editor)).toBe(true);
	});

	it("setOpenInNewTab removes the mark when false", () => {
		const editor = makeEditor();
		setOpenInNewTab(editor, true);
		setOpenInNewTab(editor, false);

		expect(getOpenInNewTabActive(editor)).toBe(false);
	});

	it("setLink adds the link mark when a selection exists", () => {
		const editor = makeEditor();
		setLink(editor, "https://example.com");

		expect(isHyperlinkActive(editor)).toBe(true);
		expect(getLinkActive(editor)).toBe("https://example.com");
	});

	it("setLink removes the link mark when called with an empty link", () => {
		const editor = makeEditor();
		setLink(editor, "https://example.com");
		setLink(editor, "");

		expect(isHyperlinkActive(editor)).toBe(false);
	});

	it("setLink inserts a paragraph node when there is no selection", () => {
		const editor = makeEditor();
		editor.selection = null;

		setLink(editor, "https://example.com");

		const lastNode = editor.children[editor.children.length - 1] as {
			type: string;
			children: { link?: string; text: string }[];
		};
		expect(lastNode.type).toBe("paragraph");
		expect(lastNode.children[0].link).toBe("https://example.com");
	});
});
