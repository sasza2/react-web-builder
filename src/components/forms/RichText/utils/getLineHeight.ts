import { Editor, Element as SlateElement } from 'slate';

import { DEFAULT_LINE_HEIGHT } from '@/consts';
import type { CustomElement } from '@/slate.d';

export const getLineHeight = (editor: Editor) => {
  const { selection } = editor;
  if (!selection) return DEFAULT_LINE_HEIGHT;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: CustomElement) => !Editor.isEditor(n)
          && SlateElement.isElement(n)
          && n?.type === 'paragraph',
    }),
  );

  if (!Array.isArray(match)) return DEFAULT_LINE_HEIGHT;
  const paragraph = match[0] as CustomElement;
  if (!paragraph) return DEFAULT_LINE_HEIGHT;

  return paragraph.lineHeight || DEFAULT_LINE_HEIGHT;
};
