import React, { useMemo } from 'react';
import { BackgroundImage, Border, BreakpointHeight } from 'types';

import { useComponentsProperty } from '@/components/ComponentsProvider';
import { removePaddingFromLastTreeElement } from '@/components/View/removePaddingFromLastTreeElement';
import { useBreakpoints } from '@/hooks/useBreakpoints';
import { useElements } from '@/hooks/useElements';
import { useAppSelector } from '@/store/useAppSelector';
import { byBreakpointId } from '@/utils/breakpoint';
import { mergeStyles } from '@/utils/styles';

import { useProperties } from '../../PropertiesProvider';
import createTreeElements from '../../View/createTreeElements';
import getBreakpointRowsByLastElement from '../../View/getBreakpointRowsByLastElement';
import { RenderBreakpoint } from '../../View/RenderBreakpoint/RenderBreakpoint';
import { RenderTree } from '../../View/RenderTree';
import { useContainerStyle } from '../useContainerStyle';
import { Empty } from './BuilderElementContainer.styled';

type BuilderElementContainerProps = {
  backgroundImage?: BackgroundImage,
  border?: Border,
  breakpointHeight: BreakpointHeight,
  boxShadow?: string,
  containerId: string,
};

export function BuilderElementContainer({
  backgroundImage,
  border,
  breakpointHeight,
  boxShadow,
  containerId,
}: BuilderElementContainerProps) {
  const { transformElementProperty } = useProperties();
  const components = useComponentsProperty();
  const { elementsExtras } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const style = useContainerStyle({
    backgroundImage,
    border,
    breakpointHeight,
    boxShadow,
  });

  const breakpoints = useBreakpoints();

  const container = useMemo(() => {
    const breakpoint = breakpoints.find(byBreakpointId(containerId));
    return breakpoint;
  }, [breakpoints, containerId]);

  const node = useMemo(() => {
    if (!container) return null;

    const elementsInContainer = elementsInBreakpoints[container.id] || [];

    if (!elementsInContainer.length) return null;
    const tree = createTreeElements(
      elementsInContainer,
      elementsExtras.current[container.id] || {},
      container.cols,
      getBreakpointRowsByLastElement(elementsInContainer, elementsExtras.current[container.id] || {}),
    );

    removePaddingFromLastTreeElement(tree);

    return tree;
  }, []);

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
      {node ? (
        <RenderTree
          breakpoint={container}
          components={components}
          node={node}
          transformElementProperty={transformElementProperty}
        />
      ) : <Empty $container={container} />}
    </RenderBreakpoint>
  );
}
