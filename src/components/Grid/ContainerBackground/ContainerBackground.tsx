import React, { useEffect, useRef } from 'react';

import { BreakpointHeight } from 'types';
import { useContainerGridStyle } from '@/hooks/container/useContainerGridStyle';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { usePageSettings } from '@/hooks/usePageSettings';
import { getBreakpointBackgroundColor, isContainer } from '@/utils/breakpoint';
import { mergeStyles } from '@/utils/styles';
import { useGridAPI } from '@/components/GridAPIProvider';
import { useContainerElementProperties } from '@/hooks/container/useContainerElementProperties';
import { Container } from './ContainerBackground.styled';
import useElementsWithRender from '../useElementsWithRender';
import { ContainerBottomLine } from '../ContainerBottomLine';

function ContainerBackgroundIn() {
  const breakpoint = useBreakpoint();
  const containerStyle = useContainerGridStyle();
  const gridAPIRef = useGridAPI();
  const pageSettings = usePageSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const elements = useElementsWithRender();

  const { background } = mergeStyles(containerStyle, {
    background: getBreakpointBackgroundColor(breakpoint, pageSettings),
  });

  const properties = useContainerElementProperties();
  const breakpointHeight = properties.breakpointHeight as BreakpointHeight;
  const height: number | null = (breakpointHeight && breakpointHeight.enabled) ? breakpointHeight.height : undefined;

  useEffect(() => {
    if (height !== undefined) return;

    const timer = setTimeout(() => {
      const backgroundSize = gridAPIRef.current.getLowestElementBottomInPixels();

      containerRef.current.style.height = `${backgroundSize}px`;
    }, 200);

    return () => {
      clearTimeout(timer);
    };
  }, [elements, height]);

  return (
    <>
      <Container $background={background} ref={containerRef} style={{ height }} />
      <ContainerBottomLine breakpoint={breakpoint} />
    </>
  );
}

export function ContainerBackground() {
  const breakpoint = useBreakpoint();
  if (!isContainer(breakpoint)) return null;

  return <ContainerBackgroundIn />;
}
