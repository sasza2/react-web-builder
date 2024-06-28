import { CSSProperties } from 'react';
import { Breakpoint, Tree } from 'types';
import { round } from './common';

export const getStyleForFixed = (child: Tree, breakpoint: Breakpoint): CSSProperties => {
  const style: CSSProperties = {
    position: 'absolute',
    width: `calc(${round(child.w / breakpoint.cols)} * var(--breakpoint-width))`,
    top: breakpoint.rowHeight * child.marginTop,
    left: `calc(${round(child.marginLeft / breakpoint.cols)} * var(--breakpoint-width))`,
  };

  return style;
};
