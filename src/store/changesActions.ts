import { addBreakpoint, removeBreakpoint, updateBreakpoint } from './breakpointsSlice';
import {
  addElementToBreakpoint,
  addElementsToBreakpoint,
  setElementsInBreakpoint,
  removeElementFromBreakpoint,
  removeAllByBreakpoint,
  setElementsInBreakpointProgrammatic,
} from './elementsInBreakpointsSlice';
import { updatePageSettings } from './pageSettingsSlice';
import { setSelectedBreakpoint } from './selectedBreakpointSlice';
import { setSelectedElement } from './selectedElementSlice';
import { setSidebarView, setSidebar } from './sidebarSlice';

const actionsImportant = [
  addBreakpoint,
  removeBreakpoint,
  updateBreakpoint,
  updatePageSettings,
  addElementToBreakpoint,
  addElementsToBreakpoint,
  setElementsInBreakpoint,
  removeElementFromBreakpoint,
  removeAllByBreakpoint,
].map((action) => action().type);

export const actionsToOmit = [
  setSelectedElement,
  setSelectedBreakpoint,
  setSidebarView,
  setSidebar,
  setElementsInBreakpointProgrammatic,
].map((action) => action().type);

export const actions = [...actionsImportant, ...actionsToOmit];
