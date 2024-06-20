import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Breakpoint } from 'types';
import { byBreakpointId, ElementsTreeInBreakpoint } from '@/utils/breakpoint';
import { pasteElements } from './elementsInBreakpointsSlice';

const initialState: Breakpoint[] = [];

type ActionAdd = PayloadAction<{ breakpoint: Breakpoint }>;

type ActionRemove = PayloadAction<{ breakpoint: Breakpoint }>;

type ActionUpdate = PayloadAction<{ breakpointId: string, breakpoint: Partial<Breakpoint> }>;

type ActionReplaceAll = PayloadAction<{ breakpoints: Breakpoint[] }>;

const updateBreakpointAction = (state: Breakpoint[], { payload: { breakpointId, breakpoint } }: ActionUpdate) => {
  const breakpointIndex = state.findIndex(byBreakpointId(breakpointId));

  const prevBreakpoint = state[breakpointIndex];
  const nextBreakpoint = {
    ...prevBreakpoint,
    ...breakpoint,
  };

  state[breakpointIndex] = nextBreakpoint;
};

export const breakpointsSlice = createSlice({
  name: 'breakpoints',
  initialState,
  reducers: {
    addBreakpoint: (state, { payload: { breakpoint } }: ActionAdd) => [...state, breakpoint],
    addBreakpointSilent: (state, { payload: { breakpoint } }: ActionAdd) => [...state, breakpoint],
    removeBreakpoint: (state, { payload: { breakpoint } }: ActionRemove) => state.filter((currentBreakpoint) => currentBreakpoint.id !== breakpoint.id),
    updateBreakpoint: updateBreakpointAction,
    updateBreakpointSilent: updateBreakpointAction,
    replaceBreakpoints: (state, { payload: { breakpoints } }: ActionReplaceAll) => {
      state.length = 0;
      state.push(...breakpoints);
    },
  },
  extraReducers: (builder) => {
    builder.addCase(pasteElements, (state, { payload }) => {
      const recursiveAdd = (elementsTree: ElementsTreeInBreakpoint[]) => {
        elementsTree.forEach((elementTree) => {
          if (elementTree.container) {
            state.push(elementTree.container);
            recursiveAdd(elementTree.children);
          }
        });
      };

      recursiveAdd(payload.elementsTree);
    });
  },
});

export const {
  addBreakpoint, addBreakpointSilent, removeBreakpoint, replaceBreakpoints, updateBreakpoint, updateBreakpointSilent,
} = breakpointsSlice.actions;

export default breakpointsSlice.reducer;
