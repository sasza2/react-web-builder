import { useEffect, useRef } from 'react';
import { BaseEditor } from 'slate';
import { ReactEditor } from 'slate-react';
import { useFrame } from 'react-frame-component';

import { useConfiguration } from '@/components/ConfigurationProvider';

type AutoFocusProps = {
  autoFocus?: boolean,
  editor: BaseEditor & ReactEditor,
};

export function AutoFocus({ autoFocus = false, editor }: AutoFocusProps): JSX.Element {
  const { autoFocusRichTextInEditProperties } = useConfiguration();
  const editorRef = useRef<typeof editor>();
  editorRef.current = editor;

  const { document: iframeDocument, window: iframeWindow } = useFrame();

  useEffect(() => {
    const timer = setInterval(() => {
      const textbox: HTMLDivElement = iframeDocument.body.querySelector('[role="textbox"]');
      if (!textbox) return;

      const scrollbox = textbox.parentNode.parentNode as HTMLDivElement;

      textbox.focus();

      iframeWindow.getSelection().selectAllChildren(textbox);
      iframeWindow.getSelection().collapseToEnd();

      if (!autoFocusRichTextInEditProperties || !autoFocus) {
        textbox.blur();
        clearInterval(timer);
        return;
      }

      scrollbox.scrollTop = scrollbox.scrollHeight;

      clearInterval(timer);
    }, autoFocus ? 400 : 200); // TODO

    return () => {
      clearInterval(timer);
    };
  }, [autoFocusRichTextInEditProperties, autoFocus]);

  return null;
}
