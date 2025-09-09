import { Editor, Element as SlateElement } from 'slate';

import type { CustomElement } from '@/slate.d';

export const isBlockActive = (editor: Editor, format: string, blockType: string) => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n: CustomElement) => !Editor.isEditor(n)
        && SlateElement.isElement(n)
        && n[blockType as keyof typeof n] === format,
    }),
  );

  return !!match;
};
