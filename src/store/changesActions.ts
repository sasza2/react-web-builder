import { addBreakpoint, removeBreakpoint, updateBreakpoint } from './breakpointsSlice';
import {
  addElementToBreakpoint,
  addElementsToBreakpoint,
  setElementsInBreakpoint,
  removeElementFromBreakpoint,
  removeElementsFromBreakpoint,
  removeAllByBreakpoint,
  setElementsInBreakpointProgrammatic,
} from './elementsInBreakpointsSlice';
import { updatePageSettings } from './pageSettingsSlice';
import { setSelectedBreakpoint } from './selectedBreakpointSlice';
import { setSelectedElement } from './selectedElementSlice';
import { setSelectedElements, toggleSelectedElement } from './selectedElementsSlice';
import { setSidebarView, setSidebar } from './sidebarSlice';

const actionsImportant = [
  addBreakpoint,
  removeBreakpoint,
  updateBreakpoint,
  updatePageSettings,
  addElementToBreakpoint,
  addElementsToBreakpoint,
  setElementsInBreakpoint,
  setSelectedElements,
  removeElementFromBreakpoint,
  removeElementsFromBreakpoint,
  removeAllByBreakpoint,
  toggleSelectedElement,
].map((action) => action().type);

export const actionsToOmit = [
  setSelectedElement,
  setSelectedBreakpoint,
  setSidebarView,
  setSidebar,
  setElementsInBreakpointProgrammatic,
].map((action) => action().type);

export const actions = [...actionsImportant, ...actionsToOmit];
