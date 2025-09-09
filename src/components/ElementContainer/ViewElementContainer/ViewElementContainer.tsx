import React, { useMemo } from 'react';
import type { BackgroundImage, Border, BreakpointHeight } from 'types';

import { useComponentsProperty } from '@/components/ComponentsProvider';
import { useViewProperties } from '@/components/PropertiesProvider';
import createTreeElements from '@/components/View/createTreeElements';
import getBreakpointRowsByLastElement from '@/components/View/getBreakpointRowsByLastElement';
import { RenderBreakpoint } from '@/components/View/RenderBreakpoint/RenderBreakpoint';
import { RenderTree } from '@/components/View/RenderTree';
import { useFontImport } from '@/hooks/useFontImport';
import { mergeStyles } from '@/utils/styles';
import { HIDE_SCROLLBAR_CLASS_NAME } from '@/View.styled';

import { useContainerStyle } from '../useContainerStyle';

type ViewElementContainerProps = {
  backgroundImage?: BackgroundImage,
  border?: Border,
  breakpointHeight: BreakpointHeight,
  boxShadow?: string,
  containerId: string,
  fontFamily?: string,
};

export function ViewElementContainer({
  backgroundImage,
  border,
  breakpointHeight,
  boxShadow,
  containerId,
  fontFamily,
}: ViewElementContainerProps) {
  const { page, transformElementProperty } = useViewProperties();
  const container = page.breakpoints.find((item) => item.id === containerId);
  const components = useComponentsProperty();
  const fontImport = useFontImport(fontFamily);

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
      className={breakpointHeight?.isScrollbarHidden ? HIDE_SCROLLBAR_CLASS_NAME : undefined}
      hasMinWidth={false}
      style={mergeStyles(
        style,
        {
          background: container.backgroundColor,
          fontFamily: fontFamily ? fontImport.fontFamily : undefined,
        },
      )}
    >
      <RenderTree
        breakpoint={container}
        components={components}
        node={node}
        transformElementProperty={transformElementProperty}
      />
      {fontFamily ? fontImport.stylesheet : undefined}
    </RenderBreakpoint>
  );
}
