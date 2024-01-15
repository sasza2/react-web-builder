import React, {
  useCallback, useMemo, useState,
} from 'react';
import { Descendant, createEditor } from 'slate';
import {
  Slate, Editable, withReact, RenderElementProps, RenderLeafProps,
} from 'slate-react';

import { TextElement } from 'types';
import { Scrollbar } from '@/components/Scrollbar';
import { Icon } from '@/components/icons/Icon';
import {
  Element, ElementProps, Leaf, LeafProps,
} from '@/components/View/Box';
import { RenderInIFrame } from '@/components/RenderInIFrame';
import { useAppSelector } from '@/store/useAppSelector';
import { Toolbar } from '../Toolbar';
import { BlockButton, MarkButton } from '../buttons';
import { FontSizeSelect } from '../FontSizeSelect/FontSizeSelect';
import { ColorSelect } from '../ColorSelect';
import { LetterSpacingSelect } from '../LetterSpacing/LetterSpacing';
import { LineHeightSelect } from '../LineHeight/LineHeight';
import {
  EditableIn, EditableMargin, EditableWrapper, IFrameWrapper,
} from './Editor.styled';
import { Hyperlink } from '../Hyperlink';
import { AutoFocus } from './AutoFocus';

type EditorProps = {
  autoFocus?: boolean,
  colorAvailable?: boolean,
  hyperlinkAvailable?: boolean,
  value: TextElement[],
  setValue: (value: TextElement[]) => void,
};

export function Editor({
  autoFocus,
  colorAvailable,
  hyperlinkAvailable,
  value = [{ type: 'paragraph', children: [{ text: '' }] }],
  setValue,
}: EditorProps) {
  const undoKey = useAppSelector((state) => state.changes.undoKey);

  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props as unknown as ElementProps} />,
    [],
  );
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => (
      <Leaf
        {...props as unknown as LeafProps}
        colorAvailable={colorAvailable}
        hyperlinkAvailable={hyperlinkAvailable}
      />
    ),
    [],
  );
  const [editor] = useState(() => withReact(createEditor()));

  const initialValue = useMemo(() => {
    if (!value || typeof value === 'string') {
      return [
        {
          type: 'paragraph',
          children: [{ text: value }],
        },
      ] as unknown as TextElement[];
    }

    return value;
  }, [undoKey, value]);

  const onChange = (nextValue: Descendant[]) => {
    const ops = editor.operations.filter((o) => {
      if (o) {
        return o.type !== 'set_selection';
      }

      return false;
    });

    if (ops && Array.isArray(ops) && ops.length > 0) {
      setValue(nextValue as TextElement[]);
    }
  };

  return (
    <Slate
      key={undoKey}
      editor={editor}
      initialValue={initialValue as Descendant[]}
      onChange={onChange}
    >
      <Toolbar>
        <FontSizeSelect />
        <MarkButton
          format="bold"
          icon={<Icon icon={Icon.TextBold} />}
          testId="bold"
        />
        <MarkButton format="italic" icon={<Icon icon={Icon.TextItalic} />} />
        <MarkButton format="underline" icon={<Icon icon={Icon.TextUnderline} />} />
        {/*
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-one" icon="looks_one" />
        <BlockButton format="heading-two" icon="looks_two" />
        <BlockButton format="block-quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        */}
        { colorAvailable !== false && <ColorSelect /> }

        <BlockButton format="left" icon={<Icon icon={Icon.TextLeft} />} />
        <BlockButton format="center" icon={<Icon icon={Icon.TextCenter} />} />
        {
          /* <BlockButton format="center" icon="format_align_center" /> */
        }
        <BlockButton format="right" icon={<Icon icon={Icon.TextRight} />} />
        <BlockButton format="justify" icon={<Icon icon={Icon.TextJustify} />} />
        <LineHeightSelect />
        <LetterSpacingSelect />
        { hyperlinkAvailable !== false && <Hyperlink /> }
      </Toolbar>
      <IFrameWrapper>
        <RenderInIFrame>
          <EditableWrapper>
            <Scrollbar>
              <EditableIn>
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                />
                <EditableMargin />
                <AutoFocus autoFocus={autoFocus} editor={editor} />
              </EditableIn>
            </Scrollbar>
          </EditableWrapper>
        </RenderInIFrame>
      </IFrameWrapper>
    </Slate>
  );
}
