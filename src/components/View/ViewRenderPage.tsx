import React, {
  useCallback, useEffect, useMemo, useState, useRef,
} from 'react';

import {
  Breakpoint, Tree,
} from 'types';
import { useFontImport } from '@/hooks/useFontImport';
import { getBreakpointBackgroundColor, getBreakpointPadding } from '@/utils/breakpoint';
import { useViewProperties } from '../PropertiesProvider';
import Element from './Element';
import { RenderInContainer } from '../RenderInContainer';
import { PageContainer } from './ViewRenderPage.styled';

export function ViewRenderPage() {
  const { components, page, transformElementProperty } = useViewProperties();
  const containerRef = useRef<HTMLDivElement>();
  const [innerWidth, setInnerWidth] = useState(0);
  const fontImport = useFontImport(page.fontFamily);

  const getContainerWidth = () => {
    if (!containerRef.current) return 0;
    return containerRef.current.getBoundingClientRect().width;
  };

  const onContainerInit = useCallback((node: HTMLDivElement) => {
    containerRef.current = node;
    setInnerWidth(getContainerWidth());
  }, []);

  useEffect(() => {
    if (!innerWidth) return;

    const onResize = () => {
      setInnerWidth(getContainerWidth());
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [innerWidth > 0]);

  const selectedBreakpoint = useMemo(() => {
    if (!innerWidth || !page || !page.breakpoints) return null;

    const sortedBreakpoints = page.breakpoints.sort((a, b) => a.from - b.from);
    let breakpoint: Breakpoint = sortedBreakpoints[0];
    for (let i = 1; i < sortedBreakpoints.length; i++) {
      const item = sortedBreakpoints[i];
      if (item.from > innerWidth) break;
      breakpoint = item;
    }

    sortedBreakpoints.forEach((item) => {
      if (breakpoint === null) {
        breakpoint = item;
        return;
      }

      if (innerWidth >= item.from && breakpoint && breakpoint.from < item.from) {
        if (item.to && item.to < innerWidth) return;
        breakpoint = item;
      }
    });

    return breakpoint;
  }, [page, innerWidth]);

  const renderTree = (node: Tree, breakpoint: Breakpoint) => {
    if (!node) return null; // TODO

    const padding = getBreakpointPadding(breakpoint);
    const maxWidth = (breakpoint.to === null ? innerWidth : breakpoint.to)
      - padding.left
      - padding.right;

    const style = {
      display: 'flex',
      width: `${node.w / breakpoint.cols * maxWidth}px`,
      marginTop: breakpoint.rowHeight * node.marginTop,
      marginBottom: breakpoint.rowHeight * node.marginBottom,
      marginLeft: `${node.marginLeft / breakpoint.cols * maxWidth}px`,
      marginRight: `${node.marginRight / breakpoint.cols * maxWidth}px`,
    };
    switch (node.type) {
      case 'row':
        return (
          <div key={node.id} style={{ flexDirection: 'column', ...style }} className="row">
            {node.children.map((tree) => renderTree(tree, breakpoint))}
          </div>
        );
      case 'column':
        return (
          <div key={node.id} style={{ flexDirection: 'row', ...style }} className="column">
            {node.children.map((tree) => renderTree(tree, breakpoint))}
          </div>
        );
      case 'component':
        if (node.element.componentName === 'Separator') return null;
        return (
          <div key={node.id} style={{ ...style }}>
            <Element
              breakpoint={breakpoint}
              element={node.element}
              components={components}
              paddingBottom={node.paddingBottom}
              transformElementProperty={transformElementProperty}
            />
          </div>
        );
      case 'fixed':
        return (
          <div
            key={node.id}
            style={{
              ...style,
              position: 'relative',
              height: `${node.h * breakpoint.rowHeight}px`,
            }}
          >
            {node.children.map((child) => (
              <div
                key={child.id}
                style={{
                  position: 'absolute',
                  width: `${child.w / breakpoint.cols * maxWidth}px`,
                  top: breakpoint.rowHeight * child.marginTop,
                  left: `${child.marginLeft / breakpoint.cols * maxWidth}px`,
                }}
              >
                <Element
                  breakpoint={breakpoint}
                  element={child.element}
                  components={components}
                  paddingBottom={child.paddingBottom}
                  transformElementProperty={transformElementProperty}
                />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  const renderPage = () => {
    if (!selectedBreakpoint) return null;

    const padding = getBreakpointPadding(selectedBreakpoint);
    const maxWidth = selectedBreakpoint.to === null ? undefined : selectedBreakpoint.to;
    return (
      <RenderInContainer breakpoint={selectedBreakpoint}>
        <PageContainer $fontImport={fontImport}>
          <div
            key={selectedBreakpoint.id}
            style={{
              boxSizing: 'border-box',
              backgroundColor: getBreakpointBackgroundColor(selectedBreakpoint, page),
              paddingTop: padding.top,
              paddingRight: padding.right,
              paddingLeft: padding.left,
              paddingBottom: padding.bottom,
              minHeight: '100%',
              minWidth: innerWidth >= selectedBreakpoint.from ? selectedBreakpoint.from : undefined,
              maxWidth,
              width: '100%',
              '--margin-vertical': selectedBreakpoint.rowHeight,
            } as React.CSSProperties}
          >
            {renderTree(selectedBreakpoint.view, selectedBreakpoint)}
          </div>
        </PageContainer>
      </RenderInContainer>
    );
  };

  return (
    <div
      className="react-web-builder-view"
      ref={onContainerInit}
    >
      {renderPage()}
      { fontImport?.stylesheet }
    </div>
  );
}
