import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { SidebarView } from '@/components/SidebarProvider';
import { removeElementFromBreakpoint } from './elementsInBreakpointsSlice';
import { setSidebar, setSidebarView } from './sidebarSlice';

const initialState: string | null = null;

type ActionSet = PayloadAction<{ elementId: string | null }>;

type ActionReplace = ActionSet;

export const selectedElementSlice = createSlice({
  name: 'selectedElement',
  initialState,
  reducers: {
    setSelectedElement: (state, { payload: { elementId } }: ActionSet) => elementId,
    replaceSelectedElement: (state, { payload: { elementId } }: ActionReplace) => elementId,
  },
  extraReducers: (builder) => {
    builder.addCase(removeElementFromBreakpoint, (state, { payload: { elementId } }) => {
      if (state === elementId) return null;
      return state;
    }).addCase(setSidebar, (state, { payload }) => {
      if (payload.view !== SidebarView.EditElement) return null;
    }).addCase(setSidebarView, (state, { payload }) => {
      if (payload !== SidebarView.EditElement) return null;
    });
  },
});

export const { replaceSelectedElement, setSelectedElement } = selectedElementSlice.actions;

export default selectedElementSlice.reducer;
