import React, { memo, useCallback } from 'react';
import { useTheme } from 'styled-components';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import getBreakpointWidth from '@/utils/getBreakpointWidth';
import { BackgroundDiv } from './Background.styled';

function Background() {
  const theme = useTheme();
  const breakpoint = useBreakpoint();
  const onInit = useCallback((node: HTMLDivElement) => {
    if (!node) return;

    const rows = 10;
    const height = breakpoint.rowHeight * rows;
    const width = getBreakpointWidth(breakpoint);
    const colWidth = width / breakpoint.cols;

    const c = document.createElement('canvas');
    c.setAttribute('width', `${width}px`);
    c.setAttribute('height', `${height}px`);
    const ctx = c.getContext('2d');
    if (ctx === null) return;

    for (let x = 0; x < breakpoint.cols; x++) {
      for (let y = 0; y < rows; y++) {
        ctx.beginPath();
        ctx.arc(colWidth * x, y * breakpoint.rowHeight, 1, 0, 2 * Math.PI);
        ctx.strokeStyle = `${theme.colors.black}40`;
        ctx.stroke();
      }
    }

    node.style.backgroundImage = `url(${c.toDataURL()})`;
    node.style.backgroundRepeat = 'repeat';
  }, [breakpoint.cols, breakpoint.rowHeight]);

  return (
    <BackgroundDiv ref={onInit} />
  );
}

export default memo(Background);
