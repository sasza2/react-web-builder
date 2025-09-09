import { Editor, Element as SlateElement, Transforms } from "slate";
import { ReactEditor } from "slate-react";

import theme from "@/components/StyleProvider/theme";
import type { CustomElement } from "@/slate.d";

import { isBlockActive } from "./isBlockActive";

const LIST_TYPES = ["numbered-list", "bulleted-list"];
export const TEXT_ALIGN_TYPES = ["left", "center", "right", "justify"];

// type IEditor = BaseEditor & ReactEditor

export const toggleBlock = (editor: Editor, format: string) => {
	const isActive = isBlockActive(
		editor,
		format,
		TEXT_ALIGN_TYPES.includes(format) ? "align" : "type",
	);
	const isList = LIST_TYPES.includes(format);

	Transforms.unwrapNodes(editor, {
		match: (n) =>
			!Editor.isEditor(n) &&
			SlateElement.isElement(n) &&
			LIST_TYPES.includes(n.type) &&
			!TEXT_ALIGN_TYPES.includes(format),
		split: true,
	});
	let newProperties: Partial<SlateElement>;
	if (TEXT_ALIGN_TYPES.includes(format)) {
		newProperties = {
			align: isActive ? undefined : format,
		};
	} else {
		newProperties = {
			type: (() => {
				if (isActive) return "paragraph";
				if (isList) return "list-item";
				return format;
			})(),
		};
	}
	Transforms.setNodes<SlateElement>(editor, newProperties);

	if (!isActive && isList) {
		const block: CustomElement = { type: format, children: [] };
		Transforms.wrapNodes(editor, block);
	}
};

export const isMarkActive = (editor: Editor, format: string) => {
	const marks = Editor.marks(editor);
	return marks ? marks[format as keyof typeof marks] === true : false;
};

export const toggleMark = (editor: Editor, format: string) => {
	const isActive = isMarkActive(editor, format);

	ReactEditor.focus(editor);

	if (isActive) {
		Editor.removeMark(editor, format);
	} else {
		Editor.addMark(editor, format, true);
	}
};

export const isColorActive = (editor: Editor, color: string) => {
	const marks = Editor.marks(editor);
	return marks ? marks.color === color : false;
};

export const toggleColor = (editor: Editor, color = theme.colors.black) => {
	Editor.addMark(editor, "color", color);
};

export const getColorActive = (editor: Editor): string => {
	const marks = Editor.marks(editor);
	if (!marks) return theme.colors.black;
	return marks.color || theme.colors.black;
};
