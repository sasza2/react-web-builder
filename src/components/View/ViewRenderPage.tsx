import React, {
  useCallback, useEffect, useMemo, useRef,
  useState,
} from 'react';
import {
  Breakpoint,
} from 'types';

import { useFontImport } from '@/hooks/useFontImport';
import { getBreakpointBackgroundColor, isBreakpoint } from '@/utils/breakpoint';

import { useComponentsProperty } from '../ComponentsProvider';
import { useViewProperties } from '../PropertiesProvider';
import { RenderInContainer } from '../RenderInContainer';
import { RenderBreakpoint } from './RenderBreakpoint/RenderBreakpoint';
import { RenderTree } from './RenderTree';
import { PageContainer } from './ViewRenderPage.styled';

export function ViewRenderPage() {
  const { page, transformElementProperty } = useViewProperties();
  const components = useComponentsProperty();
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

    const sortedBreakpoints = page.breakpoints
      .filter(isBreakpoint)
      .sort((a, b) => a.from - b.from);
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

  const renderPage = () => {
    if (!selectedBreakpoint) return null;

    return (
      <RenderInContainer breakpoint={selectedBreakpoint}>
        <PageContainer $fontImport={fontImport}>
          <RenderBreakpoint
            breakpoint={selectedBreakpoint}
            style={{
              background: getBreakpointBackgroundColor(selectedBreakpoint, page),
            }}
          >
            <RenderTree
              breakpoint={selectedBreakpoint}
              components={components}
              node={selectedBreakpoint.view}
              transformElementProperty={transformElementProperty}
            />
          </RenderBreakpoint>
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
