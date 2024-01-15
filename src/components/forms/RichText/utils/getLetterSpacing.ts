import { Editor, Element as SlateElement } from 'slate';

import { DEFAULT_LETTER_SPACING } from '@/consts';
import { CustomElement } from '@/slate.d';

export const getLetterSpacing = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return DEFAULT_LETTER_SPACING;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: CustomElement) => !Editor.isEditor(n)
          && SlateElement.isElement(n)
          && n?.type === 'paragraph',
    }),
  );

  if (!Array.isArray(match)) return DEFAULT_LETTER_SPACING;
  const paragraph = match[0] as CustomElement;
  if (!paragraph) return DEFAULT_LETTER_SPACING;

  return paragraph.letterSpacing || DEFAULT_LETTER_SPACING;
};
