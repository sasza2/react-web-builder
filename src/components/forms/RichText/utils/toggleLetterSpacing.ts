import {
  Editor,
  Transforms,
  Element as SlateElement,
} from 'slate';

export const toggleLetterSpacing = (editor: Editor, letterSpacing: string) => {
  const { selection } = editor;
  if (!selection) return false;

  Transforms.setNodes<SlateElement>(editor, { type: 'paragraph', letterSpacing });
};
