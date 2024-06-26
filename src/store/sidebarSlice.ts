import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { BreakpointId } from 'types';
import { SidebarView } from '@/components/SidebarProvider';
import { AppDispatch, GetState } from './store';
import { addBreakpoint } from './breakpointsSlice';
import { removeElementsFromBreakpoint } from './elementsInBreakpointsSlice';
import { setSelectedBreakpoint } from './selectedBreakpointSlice';
import { setSelectedElement } from './selectedElementSlice';

type SidebarState = {
  view: SidebarView | null,
};

const initialState: SidebarState = {
  view: null,
};

type ActionSetSidebarView = PayloadAction<SidebarView>;

type ActionSetSidebar = PayloadAction<{ view: SidebarView | null }>;

type ActionReplaceSidebar = ActionSetSidebar;

const updateBreakpoint = (state: SidebarState, breakpoint: { id: BreakpointId, parentId?: BreakpointId }) => {
  if (breakpoint && breakpoint.parentId) {
    return state;
  }
  state.view = SidebarView.EditBreakpoint;
};

export const sidebarSlice = createSlice({
  name: 'sidebar',
  initialState,
  reducers: {
    setSidebarView: (state, { payload: view }: ActionSetSidebarView) => {
      state.view = view;
    },
    setSidebar: (state, { payload }: ActionSetSidebar) => payload,
    replaceSidebar: (state, { payload }: ActionReplaceSidebar) => payload,
  },
  extraReducers: (builder) => {
    builder.addCase(setSelectedElement, (state, action) => {
      if (action.payload.elementId) state.view = SidebarView.EditElement;
      else state.view = SidebarView.AddElement;
    }).addCase(removeElementsFromBreakpoint, (state) => {
      if (state.view === SidebarView.EditElement) state.view = SidebarView.AddElement;
    }).addCase(setSelectedBreakpoint, (state, action) => updateBreakpoint(state, action.payload))
      .addCase(addBreakpoint, (state, action) => updateBreakpoint(state, action.payload.breakpoint));
  },
});

export const {
  replaceSidebar, setSidebarView, setSidebar,
} = sidebarSlice.actions;

type SetViewAnimation = (nextView: SidebarView | null) =>
(dispatch: AppDispatch, getState: GetState) =>
void;

export const setViewAnimation: SetViewAnimation = (nextView) => (dispatch, getState) => {
  const { view } = getState().sidebar;

  if (view === nextView) return;

  dispatch(setSidebar({
    view: nextView,
  }));
};

export default sidebarSlice.reducer;
