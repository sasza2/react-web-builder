import { Breakpoint, Page } from 'types';

import { initialState as changesInitialState } from '../store/changesSlice';
import { RootState, StateInitialChanges } from '../store/store';
import { isBreakpoint } from './breakpoint';
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
  const breakpointsWithoutContainers = breakpoints.filter(isBreakpoint);

  if (!breakpointsWithoutContainers.length) return null;
  return breakpointsWithoutContainers[breakpointsWithoutContainers.length - 1].id;
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
