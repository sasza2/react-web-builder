import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BreakpointId } from 'types';
import { isContainer } from '@/utils/breakpoint';
import { addBreakpoint, removeBreakpoint } from './breakpointsSlice';
import { setSelectedElement } from './selectedElementSlice';
import { openContainer } from './elementsInBreakpointsSlice';

const initialState: BreakpointId | null = null;

type ActionSet = PayloadAction<{ id: BreakpointId | null, parentId?: BreakpointId }>;

type ActionReplace = ActionSet;

type ActionSetSelectedElement = PayloadAction<{ breakpointId?: string | null }>;

export const selectedBreakpointSlice = createSlice({
  name: 'selectedBreakpoint',
  initialState,
  reducers: {
    setSelectedBreakpoint: (state, { payload: { id } }: ActionSet) => id || null,
    replaceBreakpoint: (state, { payload: { id } }: ActionReplace) => id || null,
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
      }).addCase(openContainer, (state, { payload: { breakpointId } }) => breakpointId);
  },
});

export const { replaceBreakpoint, setSelectedBreakpoint } = selectedBreakpointSlice.actions;

export default selectedBreakpointSlice.reducer;
