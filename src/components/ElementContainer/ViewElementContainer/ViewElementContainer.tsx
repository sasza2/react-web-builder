import React, { useMemo } from 'react';

import { mergeStyles } from '@/utils/styles';
import { useViewProperties } from '@/components/PropertiesProvider';
import { RenderBreakpoint } from '@/components/View/RenderBreakpoint/RenderBreakpoint';
import { RenderTree } from '@/components/View/RenderTree';
import { useComponentsProperty } from '@/components/ComponentsProvider';
import createTreeElements from '@/components/View/createTreeElements';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { BackgroundImage, Border, BreakpointHeight } from 'types';
import { useContainerStyle } from '../useContainerStyle';

type ViewElementContainerProps = {
  backgroundImage?: BackgroundImage,
  border?: Border,
  breakpointHeight: BreakpointHeight,
  boxShadow?: string,
  containerId: string,
};

export function ViewElementContainer({
  backgroundImage,
  border,
  breakpointHeight,
  boxShadow,
  containerId,
}: ViewElementContainerProps) {
  const { page, transformElementProperty } = useViewProperties();
  const container = page.breakpoints.find((item) => item.id === containerId);
  const components = useComponentsProperty();

  const style = useContainerStyle({
    backgroundImage,
    border,
    breakpointHeight,
    boxShadow,
  });

  const node = useMemo(() => {
    if (!container) return null;

    const elementsInContainer = page.elementsInBreakpoints[container.id] || [];

    if (!elementsInContainer.length) return null;
    return createTreeElements(
      elementsInContainer,
      page.elementsExtras[container.id] || {},
      container.cols,
      getBreakpointRowsByLastElement(elementsInContainer, page.elementsExtras[container.id] || {}),
    );
  }, []);

  if (!node) return null;
  return (
    <RenderBreakpoint
      breakpoint={container}
      hasMinWidth={false}
      style={mergeStyles(
        style,
        {
          background: container.backgroundColor,
        },
      )}
    >
      <RenderTree
        breakpoint={container}
        components={components}
        node={node}
        transformElementProperty={transformElementProperty}
      />
    </RenderBreakpoint>
  );
}
