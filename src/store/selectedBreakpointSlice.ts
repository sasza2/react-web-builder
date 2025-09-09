import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { BreakpointId } from 'types';

import { isContainer } from '@/utils/breakpoint';

import { addBreakpoint, removeAllBreakpoints, removeBreakpoint } from './breakpointsSlice';
import { openContainer } from './elementsInBreakpointsSlice';
import { setSelectedElement } from './selectedElementSlice';

const initialState: BreakpointId | null = null;

type ActionSet = PayloadAction<{ id: BreakpointId | null, parentId?: BreakpointId }>;

type ActionReplace = ActionSet;

type ActionSetSelectedElement = PayloadAction<{ breakpointId?: string | null }>;

export const selectedBreakpointSlice = createSlice({
  name: 'selectedBreakpoint',
  initialState,
  reducers: {
    setSelectedBreakpoint: (_state, { payload: { id } }: ActionSet) => id || null,
    replaceBreakpoint: (_state, { payload: { id } }: ActionReplace) => id || null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBreakpoint, (state, { payload: { breakpoint } }) => (isContainer(breakpoint) ? state : breakpoint.id))
      .addCase(removeBreakpoint, (state, { payload: { breakpoint } }) => {
        if (state === breakpoint.id) return null;
        return state;
      })
      .addCase(setSelectedElement, (state, { payload: { breakpointId } }: ActionSetSelectedElement) => {
        if (breakpointId !== undefined) return breakpointId;
        return state;
      }).addCase(openContainer, (_state, { payload: { breakpointId } }) => breakpointId)
      .addCase(removeAllBreakpoints, () => null);
  },
});

export const { replaceBreakpoint, setSelectedBreakpoint } = selectedBreakpointSlice.actions;

export default selectedBreakpointSlice.reducer;
