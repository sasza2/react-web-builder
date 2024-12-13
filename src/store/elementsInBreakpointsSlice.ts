import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Breakpoint,
  ElementsInBreakpoints, WebBuilderElement, WebBuilderElements,
} from 'types';

import { ElementsTreeInBreakpoint } from '@/utils/breakpoint';

import { removeAllBreakpoints } from './breakpointsSlice';

const initialState: ElementsInBreakpoints = {};

type ActionAdd = PayloadAction<{ element: WebBuilderElement, breakpointId: string }>;

type ActionAddMultiple = PayloadAction<{ elements: WebBuilderElement[], breakpointId: string }>;

type ActionChangeElementInBreakpoint = PayloadAction<{ element: Partial<WebBuilderElement>, breakpointId: string }>;

type ActionRemoveMultiple = PayloadAction<{
  elementsTree: ElementsTreeInBreakpoint[],
  currentBreakpoint: Breakpoint,
  removeBreakpoint?: boolean,
}>;

type ActionSet = PayloadAction<{ elements: WebBuilderElements, breakpointId: string }>;

type ActionOpenContainer = ActionSet;

type ActionReplace = PayloadAction<{ elementsInBreakpoints: ElementsInBreakpoints }>;

type ActionPaste = PayloadAction<{
  elementsTree: ElementsTreeInBreakpoint[],
  currentBreakpoint: Breakpoint,
}>;

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
    changeElementInBreakpoint: (state, { payload: { element, breakpointId } }: ActionChangeElementInBreakpoint) => {
      const currentElementIndex = state[breakpointId].findIndex((item) => item.id === element.id);
      if (currentElementIndex < 0) return;

      const currentElement = state[breakpointId][currentElementIndex];

      state[breakpointId][currentElementIndex] = {
        ...currentElement,
        ...element,
      };
    },
    pasteElements: (state, { payload }: ActionPaste) => {
      const addRecursive = (currentBreakpoint: Breakpoint, elementsTree: ElementsTreeInBreakpoint[]) => {
        elementsTree.forEach((elementTree) => {
          if (!state[currentBreakpoint.id]) state[currentBreakpoint.id] = [];

          state[currentBreakpoint.id].push(elementTree.element);

          if (elementTree.container) {
            addRecursive(elementTree.container, elementTree.children);
          }
        });
      };

      addRecursive(payload.currentBreakpoint, payload.elementsTree);
    },
    openContainer: (state, { payload: { elements, breakpointId } }: ActionOpenContainer) => {
      state[breakpointId] = elements;
    },
    setElementsInBreakpoint: (state, { payload: { elements, breakpointId } }: ActionSet) => {
      state[breakpointId] = elements;
    },
    setElementsInBreakpointProgrammatic: (state, { payload: { elements, breakpointId } }: ActionSet) => {
      state[breakpointId] = elements;
    },
    removeElementsFromBreakpoint: (
      state,
      { payload }: ActionRemoveMultiple,
    ) => {
      const removeRecursive = (breakpoint: Breakpoint, elementsTree: ElementsTreeInBreakpoint[]) => {
        elementsTree.forEach((elementTree) => {
          if (elementTree.container) {
            delete state[elementTree.container.id];
            removeRecursive(elementTree.container, elementTree.children);
          }

          if (state[breakpoint.id]) {
            state[breakpoint.id] = state[breakpoint.id].filter((element) => element.id !== elementTree.element.id);
          }
        });
      };

      removeRecursive(payload.currentBreakpoint, payload.elementsTree);

      if (payload.removeBreakpoint) delete state[payload.currentBreakpoint.id];
    },
    replaceElementsInBreakpoint: (
      state,
      { payload: { elementsInBreakpoints } }: ActionReplace,
    ) => elementsInBreakpoints,
  },
  extraReducers: (builder) => {
    builder.addCase(removeAllBreakpoints, () => null);
  },
});

export const {
  addElementToBreakpoint,
  addElementsToBreakpoint,
  changeElementInBreakpoint,
  openContainer,
  pasteElements,
  setElementsInBreakpoint,
  setElementsInBreakpointProgrammatic,
  removeElementsFromBreakpoint,
  replaceElementsInBreakpoint,
} = elementsInBreakpointsSlice.actions;

export default elementsInBreakpointsSlice.reducer;
