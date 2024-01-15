import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { addBreakpoint, removeBreakpoint } from './breakpointsSlice';

const initialState: string | null = null;

type ActionSet = PayloadAction<{ breakpointId: string | null }>;

type ActionReplace = ActionSet;

export const selectedBreakpointSlice = createSlice({
  name: 'selectedBreakpoint',
  initialState,
  reducers: {
    setSelectedBreakpoint: (state, { payload: { breakpointId } }: ActionSet) => breakpointId,
    replaceBreakpoint: (state, { payload: { breakpointId } }: ActionReplace) => breakpointId,
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBreakpoint, (state, { payload: { breakpoint } }) => breakpoint.id)
      .addCase(removeBreakpoint, (state, { payload: { breakpoint } }) => {
        if (state === breakpoint.id) return null;
        return state;
      });
  },
});

export const { replaceBreakpoint, setSelectedBreakpoint } = selectedBreakpointSlice.actions;

export default selectedBreakpointSlice.reducer;
