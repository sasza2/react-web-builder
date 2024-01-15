import React from 'react';

import { DEFAULT_LETTER_SPACING, DEFAULT_LINE_HEIGHT } from '@/consts';
import { Paragraph } from './Element.styled';

export type ElementProps = {
  attributes: Record<string, unknown>,
  element: {
    align: string,
    type: string,
    letterSpacing: string,
    lineHeight: string,
  },
};

export function Element({
  attributes,
  children,
  element,
}: React.PropsWithChildren<ElementProps>) {
  const style = {
    textAlign: element.align,
    letterSpacing: element.letterSpacing || DEFAULT_LETTER_SPACING,
    lineHeight: element.lineHeight || DEFAULT_LINE_HEIGHT,
  } as React.CSSProperties;

  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      );
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      );
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      );
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      );
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      );
    default:
      return (
        <Paragraph style={style} {...attributes}>
          {children}
        </Paragraph>
      );
  }
}

export default Element;
