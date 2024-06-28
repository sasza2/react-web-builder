import { isBreakpoint } from '@/utils/breakpoint';
import { CSSProperties } from 'react';
import { Breakpoint, Tree } from 'types';
import { round } from './common';

export const getStyleForBreakpoint = (node: Tree, breakpoint: Breakpoint): CSSProperties => {
  const width = node.w === breakpoint.cols
    ? 'var(--breakpoint-width)'
    : `calc(${round(node.w / breakpoint.cols)} * var(--breakpoint-width))`;

  const offsetTop = breakpoint.rowHeight * node.marginTop;

  const style = {
    display: 'flex',
    width,
    marginTop: isBreakpoint(breakpoint) ? offsetTop : 0,
    paddingTop: isBreakpoint(breakpoint) ? 0 : offsetTop,
    marginBottom: breakpoint.rowHeight * node.marginBottom,
    marginLeft: node.marginLeft ? `calc(${round(node.marginLeft / breakpoint.cols)} * var(--breakpoint-width))` : undefined,
    marginRight: node.marginRight ? `calc(${round(node.marginRight / breakpoint.cols)} * var(--breakpoint-width))` : undefined,
  };

  return style;
};
