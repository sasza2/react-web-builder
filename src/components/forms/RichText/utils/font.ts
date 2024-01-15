import { Editor } from 'slate';

export const isFontSizeActive = (editor: Editor, fontSize: number) => {
  const marks = Editor.marks(editor);
  return marks ? marks.fontSize === fontSize : false;
};

export const toggleFontSize = (editor: Editor, fontSize = 12) => {
  const isActive = isFontSizeActive(editor, fontSize);

  if (isActive) {
    Editor.removeMark(editor, 'fontSize');
  } else {
    Editor.addMark(editor, 'fontSize', fontSize);
  }
};

export const getFontSizeActive = (editor: Editor): number => {
  const marks = Editor.marks(editor);
  if (!marks) return 12; // TODO
  return parseInt(`${marks.fontSize}`) || 12;
};
