import { Editor, Transforms } from "slate";
import { ReactEditor } from "slate-react";

export const isHyperlinkActive = (editor: Editor) => {
	const marks = Editor.marks(editor);
	return marks ? !!marks.link : false;
};

export const setOpenInNewTab = (editor: Editor, openInNewTab: boolean) => {
	ReactEditor.focus(editor);
	if (openInNewTab) {
		Editor.addMark(editor, "openInNewTab", true);
	} else {
		Editor.removeMark(editor, "openInNewTab");
	}
};

export const setLink = (editor: Editor, link: string) => {
	ReactEditor.focus(editor);

	if (!editor.selection) {
		Transforms.insertNodes(editor, {
			type: "paragraph",
			children: [
				{
					link,
					text: "",
				},
			],
		});
		return;
	}

	if (link) {
		Editor.addMark(editor, "link", link);
	} else {
		Editor.removeMark(editor, "link");
	}
};

export const getLinkActive = (editor: Editor): string => {
	const marks = Editor.marks(editor);
	if (!marks) return "";
	return marks.link || "";
};

export const getOpenInNewTabActive = (editor: Editor): boolean => {
	const marks = Editor.marks(editor);
	if (!marks) return false;
	return marks.openInNewTab || false;
};
