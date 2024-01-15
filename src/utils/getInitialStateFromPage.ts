import { Breakpoint, Page } from 'types';

import { RootState, StateInitialChanges } from '../store/store';
import { initialState as changesInitialState } from '../store/changesSlice';
import generateDefaultBreakpoints from './generateDefaultBreakpoints';
import { getPageSettings } from './pageSettings';

type GetInitialStateFromPage = (page?: Page) => StateInitialChanges & {
  changes?: RootState['changes'],
};

const wrapInitialStateWithChanges = (initialState: StateInitialChanges) => ({
  ...initialState,
  changes: {
    ...changesInitialState,
    initial: initialState,
  },
});

const getLastBreakpointId = (breakpoints: Breakpoint[]) => {
  if (!breakpoints.length) return null;
  return breakpoints[breakpoints.length - 1].id;
};

const getInitialStateFromPage: GetInitialStateFromPage = (page) => {
  if (!page) {
    const defaultBreakpoints = generateDefaultBreakpoints();
    return wrapInitialStateWithChanges({
      breakpoints: defaultBreakpoints,
      selectedBreakpoint: getLastBreakpointId(defaultBreakpoints),
    });
  }

  const breakpoints = page.breakpoints || [];

  return wrapInitialStateWithChanges({
    breakpoints,
    elementsInBreakpoints: page.elementsInBreakpoints || {},
    selectedBreakpoint: getLastBreakpointId(breakpoints),
    pageSettings: getPageSettings(page),
  });
};

export default getInitialStateFromPage;
