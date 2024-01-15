import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Breakpoint } from 'types';

type ActionAdd = PayloadAction<{ breakpoint: Breakpoint }>;

type ActionRemove = PayloadAction<{ breakpoint: Breakpoint }>;

type ActionUpdate = PayloadAction<{ breakpointId: string, breakpoint: Partial<Breakpoint> }>;

type ActionReplaceAll = PayloadAction<{ breakpoints: Breakpoint[] }>;

export const breakpointsSlice = createSlice({
  name: 'breakpoints',
  initialState: [] as Breakpoint[],
  reducers: {
    addBreakpoint: (state, { payload: { breakpoint } }: ActionAdd) => [...state, breakpoint],
    removeBreakpoint: (state, { payload: { breakpoint } }: ActionRemove) => state.filter((currentBreakpoint) => currentBreakpoint.id !== breakpoint.id),
    updateBreakpoint: (state, { payload: { breakpointId, breakpoint } }: ActionUpdate) => {
      const breakpointIndex = state.findIndex(
        (currentBreakpoint) => currentBreakpoint.id === breakpointId,
      );
      const prevBreakpoint = state[breakpointIndex];
      const nextBreakpoint = {
        ...prevBreakpoint,
        ...breakpoint,
      };
      state[breakpointIndex] = nextBreakpoint;
    },
    replaceBreakpoints: (state, { payload: { breakpoints } }: ActionReplaceAll) => {
      state.length = 0;
      state.push(...breakpoints);
    },
  },
});

export const {
  addBreakpoint, removeBreakpoint, replaceBreakpoints, updateBreakpoint,
} = breakpointsSlice.actions;

export default breakpointsSlice.reducer;
