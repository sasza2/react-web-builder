import {
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate';

export const toggleLineHeight = (editor: Editor, lineHeight: string) => {
  const { selection } = editor;
  if (!selection) return false;

  Transforms.setNodes<SlateElement>(editor, { type: 'paragraph', lineHeight });
};
