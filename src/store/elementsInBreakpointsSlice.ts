import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { WebBuilderElement, WebBuilderElements, ElementsInBreakpoints } from 'types';

const initialState: ElementsInBreakpoints = {};

type ActionAdd = PayloadAction<{ element: WebBuilderElement, breakpointId: string }>;

type ActionAddMultiple = PayloadAction<{ elements: WebBuilderElement[], breakpointId: string }>;

type ActionChangeElementInBreakpoint = PayloadAction<{ element: Partial<WebBuilderElement>, breakpointId: string }>;

type ActionRemove = PayloadAction<{ elementId: string | number, breakpointId: string }>;

type ActionRemoveMultiple = PayloadAction<{ elementsIds: Array<string | number>, breakpointId: string }>;

type ActionRemoveAllByBreakpoint = PayloadAction<{ breakpointId: string }>;

type ActionSet = PayloadAction<{ elements: WebBuilderElements, breakpointId: string }>;

type ActionReplace = PayloadAction<{ elementsInBreakpoints: ElementsInBreakpoints }>;

export const elementsInBreakpointsSlice = createSlice({
  name: 'elementsInBreakpoints',
  initialState,
  reducers: {
    addElementToBreakpoint: (state, { payload: { element, breakpointId } }: ActionAdd) => {
      if (!state[breakpointId]) state[breakpointId] = [];
      state[breakpointId].push(element);
    },
    addElementsToBreakpoint: (state, { payload: { elements, breakpointId } }: ActionAddMultiple) => {
      if (!state[breakpointId]) state[breakpointId] = [];
      state[breakpointId].push(...elements);
    },
    changeElementInBreakpoint: (state, { payload: { element, breakpointId }}: ActionChangeElementInBreakpoint) => {
      const currentElementIndex = state[breakpointId].findIndex(item => item.id === element.id)
      if (currentElementIndex < 0) return

      const currentElement = state[breakpointId][currentElementIndex]

      state[breakpointId][currentElementIndex] = {
        ...currentElement,
        ...element,
      }
    },
    setElementsInBreakpoint: (state, { payload: { elements, breakpointId } }: ActionSet) => {
      state[breakpointId] = elements;
    },
    setElementsInBreakpointProgrammatic: (state, { payload: { elements, breakpointId } }: ActionSet) => {
      state[breakpointId] = elements;
    },
    removeElementFromBreakpoint: (
      state,
      { payload: { elementId, breakpointId } }: ActionRemove,
    ) => {
      if (!state[breakpointId]) return state;
      state[breakpointId] = state[breakpointId].filter((element) => element.id !== elementId);
    },
    removeElementsFromBreakpoint: (
      state,
      { payload: { elementsIds, breakpointId } }: ActionRemoveMultiple,
    ) => {
      if (!state[breakpointId]) return state;
      state[breakpointId] = state[breakpointId].filter((element) => !elementsIds.includes(element.id));
    },
    removeAllByBreakpoint: (
      state,
      { payload: { breakpointId } }: ActionRemoveAllByBreakpoint,
    ) => {
      delete state[breakpointId];
    },
    replaceElementsInBreakpoint: (
      state,
      { payload: { elementsInBreakpoints } }: ActionReplace,
    ) => elementsInBreakpoints,
  },
});

export const {
  addElementToBreakpoint,
  addElementsToBreakpoint,
  changeElementInBreakpoint,
  setElementsInBreakpoint,
  setElementsInBreakpointProgrammatic,
  removeElementFromBreakpoint,
  removeElementsFromBreakpoint,
  removeAllByBreakpoint,
  replaceElementsInBreakpoint,
} = elementsInBreakpointsSlice.actions;

export default elementsInBreakpointsSlice.reducer;
