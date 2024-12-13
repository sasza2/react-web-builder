import React, {
  createContext, useCallback, useContext, useState,
} from 'react';
import { Page } from 'types';

import { useBreakpoints } from '@/hooks/useBreakpoints';
import { addBreakpointSilent, removeAllBreakpoints } from '@/store/breakpointsSlice';
import { changesStartTransaction, changesStopTransaction } from '@/store/changesTransactions';
import { setPageSettings } from '@/store/pageSettingsSlice';
import { setSelectedBreakpoint } from '@/store/selectedBreakpointSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { getLastBreakpointId } from '@/utils/getInitialStateFromPage';
import { getPageSettings } from '@/utils/pageSettings';

import { LoadMultipleBreakpoints } from '../LoadMultipleBreakpoints';

const RestartTemplateContext = createContext<((template: Page) => void) | null>(null);

export const useRestartTemplate = () => {
  const restartTemplate = useContext(RestartTemplateContext);
  return restartTemplate;
};

export function RestartTemplate({ children }: React.PropsWithChildren) {
  const dispatch = useAppDispatch();
  const breakpoints = useBreakpoints();
  const [template, setTemplate] = useState<Page | null>(null);

  const onRestart = useCallback((nextTemplate: Page) => {
    setTemplate(nextTemplate);
  }, [setTemplate]);

  const afterLoadingAll = useCallback(() => {
    dispatch(setSelectedBreakpoint({ id: getLastBreakpointId(template.breakpoints) }));
    dispatch(setPageSettings({ pageSettings: getPageSettings(template) }));
    dispatch(changesStopTransaction());
    setTemplate(null);
  }, [dispatch, setTemplate, template]);

  const beforeLoadingAll = useCallback(() => {
    dispatch(changesStartTransaction());
    dispatch(removeAllBreakpoints());
    template.breakpoints.forEach((breakpoint) => {
      dispatch(addBreakpointSilent({ breakpoint }));
    });
  }, [breakpoints, dispatch, template]);

  return (
    <>
      <RestartTemplateContext.Provider value={onRestart}>
        {children}
      </RestartTemplateContext.Provider>
      {template?.breakpoints && (
        <LoadMultipleBreakpoints
          afterLoadingAll={afterLoadingAll}
          beforeLoadingAll={beforeLoadingAll}
          breakpoints={template.breakpoints}
        />
      )}
    </>
  );
}
