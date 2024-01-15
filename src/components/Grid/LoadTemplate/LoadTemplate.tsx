import React, { useRef, useState } from 'react';

import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { shouldLoadTemplate, shouldLoadTemplateForBreakpoint } from '@/utils/breakpoint';
import { commitHistory } from '@/store/changesSlice';
import { TemplateLoaderAnimation } from '@/components/TemplateLoaderAnimation';
import { WAIT_FOR_LOAD } from '@/consts';
import { Breakpoint } from 'types';
import { LoadBreakpoint } from '../LoadBreakpoint';

export function LoadTemplate({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const store = useAppSelector((state) => state);
  const storeRef = useRef<typeof store>();
  storeRef.current = store;
  const { page } = useWebBuilderProperties();
  const [templateLoading, setTemplateLoading] = useState(() => shouldLoadTemplate(page));
  const loadedBreakpointsRef = useRef<Set<string>>();
  if (!loadedBreakpointsRef.current) loadedBreakpointsRef.current = new Set();

  const onStartLoadingBreakpoint = (breakpoint: Breakpoint) => {
    loadedBreakpointsRef.current.add(breakpoint.id);
  };

  const onFinishLoadingBreakpoint = (breakpoint: Breakpoint) => {
    loadedBreakpointsRef.current.delete(breakpoint.id);

    if (!loadedBreakpointsRef.current.size) {
      setTemplateLoading(false);
      dispatch(commitHistory({ initial: storeRef.current }));
    }
  };

  if (templateLoading) {
    return (
      <>
        <TemplateLoaderAnimation duration={WAIT_FOR_LOAD * 2} />
        {page.breakpoints
          .filter((breakpoint) => shouldLoadTemplateForBreakpoint(page, breakpoint))
          .map((breakpoint) => (
            <LoadBreakpoint
              key={breakpoint.id}
              breakpoint={breakpoint}
              onStartLoading={onStartLoadingBreakpoint}
              onFinishLoading={onFinishLoadingBreakpoint}
            />
          ))}
      </>
    );
  }

  return children as JSX.Element;
}
