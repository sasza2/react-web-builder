import React from 'react';

import { ILeaf } from 'types';
import { isLightColor } from '@/utils/colors';
import { SLATE_HIGHLIGHTED } from '@/components/forms/RichText/Editor/Editor.styled';

export type LeafProps = {
  attributes: Record<string, unknown>,
  colorAvailable?: boolean,
  hyperlinkAvailable?: boolean,
  leaf: ILeaf,
};

export function Leaf({
  attributes,
  children,
  colorAvailable,
  hyperlinkAvailable,
  leaf,
}: React.PropsWithChildren<LeafProps>) {
  const { className } = attributes || {};
  let leafClassName = (className || '') as string;

  if (hyperlinkAvailable !== false && leaf.link) {
    children = <a href={leaf.link}>{children}</a>;
  }

  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
  }

  if (leaf.italic) {
    children = <i>{children}</i>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  const style: React.CSSProperties = {};

  style.fontSize = leaf.fontSize || 12;

  if (colorAvailable !== false && leaf.color) {
    style.color = leaf.color;
    if (isLightColor(leaf.color)) {
      if (leafClassName) leafClassName = `${leafClassName} .${SLATE_HIGHLIGHTED}`;
      else leafClassName = SLATE_HIGHLIGHTED;
    }
  }

  if (!children) return null;
  return (
    <span
      {...attributes}
      className={leafClassName || undefined}
      style={style}
    >
      {children}
    </span>
  );
}
