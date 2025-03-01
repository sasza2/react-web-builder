import React, { useRef } from 'react';
import { Breakpoint } from 'types';

import { TemplateLoaderAnimation } from '@/components/TemplateLoaderAnimation';

import { LoadBreakpoint } from '../LoadBreakpoint';
import { Container } from './LoadMultipleBreakpoint.styled';

type LoadMultipleBreakpointsProps = {
  afterLoadingAll?: () => void,
  breakpoints: Breakpoint[],
  onStartLoadingBreakpoint?: (breakpoint: Breakpoint) => void,
  onFinishLoadingBreakpoint?: (breakpoint: Breakpoint) => void,
  beforeLoadingAll?: () => void,
};

export function LoadMultipleBreakpoints({
  afterLoadingAll,
  beforeLoadingAll,
  breakpoints,
  onStartLoadingBreakpoint,
  onFinishLoadingBreakpoint,
}: LoadMultipleBreakpointsProps) {
  const loadedBreakpointsRef = useRef<Set<string>>();
  if (!loadedBreakpointsRef.current) loadedBreakpointsRef.current = new Set();

  const onStartLoadingBreakpointInternal = (breakpoint: Breakpoint) => {
    if (!loadedBreakpointsRef.current.size) {
      if (beforeLoadingAll) beforeLoadingAll();
    }

    if (onStartLoadingBreakpoint) onStartLoadingBreakpoint(breakpoint);

    loadedBreakpointsRef.current.add(breakpoint.id);
  };

  const onFinishLoadingBreakpointInternal = (breakpoint: Breakpoint) => {
    if (onFinishLoadingBreakpoint) onFinishLoadingBreakpoint(breakpoint);

    loadedBreakpointsRef.current.delete(breakpoint.id);

    if (!loadedBreakpointsRef.current.size) {
      if (afterLoadingAll) afterLoadingAll();
    }
  };

  return (
    <>
      <TemplateLoaderAnimation />
      <Container>
        {breakpoints.length > 0 && (
          breakpoints
            .map((breakpoint) => (
              <LoadBreakpoint
                key={breakpoint.id}
                breakpoint={breakpoint}
                onStartLoading={onStartLoadingBreakpointInternal}
                onFinishLoading={onFinishLoadingBreakpointInternal}
              />
            )))}
      </Container>
    </>
  );
}
