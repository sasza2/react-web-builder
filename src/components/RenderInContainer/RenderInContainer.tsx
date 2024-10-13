import React from 'react';
import { RenderInContainerProps } from 'types';

import { getBreakpointBackgroundColor } from '@/utils/breakpoint';

import { useProperties } from '../PropertiesProvider';

export function RenderInContainer({ children, breakpoint }: RenderInContainerProps) {
  const { container, page } = useProperties();

  if (container) {
    const Container = container;
    return (
      <Container
        backgroundColor={getBreakpointBackgroundColor(breakpoint, page)}
        breakpoint={breakpoint}
        page={page}
      >
        {children}
      </Container>
    );
  }

  return children as JSX.Element;
}
