import React from 'react';
import type { ILeaf } from 'types';

import { SLATE_HIGHLIGHTED } from '@/components/forms/RichText/Editor/Editor.styled';
import { ColorType, isLightColor } from '@/utils/colors';
import { getColorType } from '@/utils/colors/common';

const applyColor = (color: string, style: React.CSSProperties = {}): React.CSSProperties => {
  const colorType = getColorType(color);

  if (colorType === ColorType.Gradient) {
    style.background = color;
    style.WebkitBackgroundClip = 'text';
    style.WebkitTextFillColor = 'transparent';
  } else {
    style.color = color;
  }

  return style;
};

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
    children = <a style={applyColor(leaf.color)} href={leaf.link}>{children}</a>;
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
    applyColor(leaf.color, style);

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
