import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WebBuilderElements } from 'types';

import { groupElementsById } from '@/utils/element';

import { removeAllBreakpoints, removeBreakpoint } from './breakpointsSlice';
import {
  openContainer,
  removeElementsFromBreakpoint,
  setElementsInBreakpoint,
  setElementsInBreakpointProgrammatic,
} from './elementsInBreakpointsSlice';
import { setSelectedBreakpoint } from './selectedBreakpointSlice';

const initialState: Array<string | number> = [];

type ActionSet = PayloadAction<{ elementsIds: Array<string | number> }>;

type ActionRemove = PayloadAction<{ elementId: string | number }>;

type ActionReplace = ActionSet;

const resetSelectedElements = (): typeof initialState => [];

const removeDeletedElements = (state: typeof initialState, elements: WebBuilderElements) => {
  const elementsById = groupElementsById(elements);
  const nextState = state.filter((elementId) => elementsById[elementId]);
  if (nextState.length === state.length) return state;
  return nextState;
};

const removeByElementId = (state: typeof initialState, elementId: string | number): typeof initialState => {
  if (state.includes(elementId)) {
    return state.filter((currentElementId) => currentElementId !== elementId);
  }
  return state;
};

export const selectedElementSlice = createSlice({
  name: 'selectedElements',
  initialState,
  reducers: {
    setSelectedElements: (state, { payload: { elementsIds } }: ActionSet) => elementsIds,
    toggleSelectedElement: (state, { payload: { elementId } }: ActionRemove) => {
      if (state.includes(elementId)) {
        return removeByElementId(state, elementId);
      }
      return [...state, elementId];
    },
    replaceSelectedElements: (state, { payload: { elementsIds } }: ActionReplace) => elementsIds,
  },
  extraReducers: (builder) => {
    builder.addCase(removeBreakpoint, resetSelectedElements)
      .addCase(setSelectedBreakpoint, resetSelectedElements)
      .addCase(
        setElementsInBreakpoint,
        (state, { payload: { elements } }) => removeDeletedElements(state, elements),
      )
      .addCase(
        setElementsInBreakpointProgrammatic,
        (state, { payload: { elements } }) => removeDeletedElements(state, elements),
      )
      .addCase(removeElementsFromBreakpoint, resetSelectedElements)
      .addCase(openContainer, () => initialState)
      .addCase(removeAllBreakpoints, () => initialState);
  },
});

export const {
  setSelectedElements, toggleSelectedElement, replaceSelectedElements,
} = selectedElementSlice.actions;

export default selectedElementSlice.reducer;
