import React, { useLayoutEffect, useMemo, useRef } from 'react';

import { Breakpoint } from 'types';
import { getBreakpointPadding } from '@/utils/breakpoint';

type RenderBreakpointProps = React.PropsWithChildren<{
  breakpoint: Breakpoint,
  hasMinWidth?: boolean,
  style?: React.CSSProperties,
}>;

export function RenderBreakpoint({
  breakpoint,
  children,
  hasMinWidth = true,
  style = {},
}: RenderBreakpointProps) {
  const padding = getBreakpointPadding(breakpoint);
  const paddingWidth = padding.left + padding.right;
  const maxWidth = breakpoint.to === null ? undefined : breakpoint.to;
  const breakpointRef = useRef<HTMLDivElement>();

  const minWidth = useMemo(() => {
    if (!hasMinWidth) return;

    return window.innerWidth >= breakpoint.from ? breakpoint.from : undefined;
  }, [breakpoint.from, hasMinWidth]);

  const breakpointStyle = {
    ...style,
    boxSizing: 'border-box',
    paddingTop: padding.top,
    paddingRight: padding.right,
    paddingLeft: padding.left,
    paddingBottom: padding.bottom,
    minHeight: '100%',
    minWidth,
    maxWidth,
    width: '100%',
    '--margin-vertical': breakpoint.rowHeight,
  } as React.CSSProperties;

  useLayoutEffect(() => {
    const ref = breakpointRef.current;

    if (!ref) return;

    const onUpdate = () => {
      const currentBreakpointWidth = ref.clientWidth - (paddingWidth);

      ref.style.setProperty('--breakpoint-width', `${currentBreakpointWidth}px`);
      ref.style.setProperty('--breakpoint-scale', `${(breakpoint.from - paddingWidth) / currentBreakpointWidth}`);
    };

    onUpdate();

    const resizeObserver = new ResizeObserver(onUpdate);

    resizeObserver.observe(ref);

    return () => {
      resizeObserver.disconnect();
    };
  }, [breakpoint.from, breakpointRef, paddingWidth]);

  return (
    <div
      key={breakpoint.id}
      data-test-id={`breakpoint-${breakpoint.id}`}
      style={breakpointStyle}
      ref={breakpointRef}
    >
      {children}
    </div>
  );
}
