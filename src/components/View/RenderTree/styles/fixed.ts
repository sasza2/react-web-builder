import { CSSProperties } from 'react';
import { Breakpoint, Tree } from 'types';
import { round } from './common';

export const getStyleForFixedParent = (node: Tree, breakpoint: Breakpoint): CSSProperties => {
  const style: CSSProperties = {
    position: 'relative',
    minHeight: `calc(${node.h * breakpoint.rowHeight}px * var(--breakpoint-scale))`,
  };

  return style;
};

export const getStyleForFixedChild = (child: Tree, breakpoint: Breakpoint): CSSProperties => {
  const style: CSSProperties = {
    position: 'absolute',
    width: `calc(${round(child.w / breakpoint.cols)} * var(--breakpoint-width))`,
    top: `calc(${breakpoint.rowHeight * child.marginTop}px * var(--breakpoint-scale))`,
    left: `calc(${round(child.marginLeft / breakpoint.cols)} * var(--breakpoint-width))`,
  };

  return style;
};
