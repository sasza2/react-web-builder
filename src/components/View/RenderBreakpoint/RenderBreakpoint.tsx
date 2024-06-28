import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { Breakpoint } from 'types';
import { getBreakpointPadding } from '@/utils/breakpoint';

type RenderBreakpointProps = React.PropsWithChildren<{
  backgroundColor?: React.CSSProperties['backgroundColor'],
  breakpoint: Breakpoint,
  hasMinWidth?: boolean,
  style?: React.CSSProperties,
}>;

export function RenderBreakpoint({
  backgroundColor,
  breakpoint,
  children,
  hasMinWidth = true,
  style = {},
}: RenderBreakpointProps) {
  const padding = getBreakpointPadding(breakpoint);
  const maxWidth = breakpoint.to === null ? undefined : breakpoint.to;
  const breakpointRef = useRef<HTMLDivElement>();

  useLayoutEffect(() => {
    const ref = breakpointRef.current;

    if (!ref) return;

    const onUpdate = () => {
      ref.style.setProperty('--breakpoint-width', `${ref.clientWidth - (padding.left + padding.right)}px`);
    };

    onUpdate();

    const resizeObserver = new ResizeObserver(onUpdate);

    resizeObserver.observe(ref);

    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpointRef, padding.left, padding.right]);

  const minWidth = useMemo(() => {
    if (!hasMinWidth) return;

    return window.innerWidth >= breakpoint.from ? breakpoint.from : undefined;
  }, [breakpoint.from, hasMinWidth]);

  return (
    <div
      key={breakpoint.id}
      style={{
        ...style,
        boxSizing: 'border-box',
        backgroundColor: backgroundColor || style.backgroundColor,
        paddingTop: padding.top,
        paddingRight: padding.right,
        paddingLeft: padding.left,
        paddingBottom: padding.bottom,
        minHeight: '100%',
        minWidth,
        maxWidth,
        width: '100%',
        '--margin-vertical': breakpoint.rowHeight,
      } as React.CSSProperties}
      ref={breakpointRef}
    >
      {children}
    </div>
  );
}
