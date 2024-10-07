import {
  addBreakpoint, addBreakpointSilent, removeBreakpoint, updateBreakpoint, updateBreakpointSilent,
} from './breakpointsSlice';
import {
  addElementToBreakpoint,
  addElementsToBreakpoint,
  changeElementInBreakpoint,
  setElementsInBreakpoint,
  removeElementsFromBreakpoint,
  setElementsInBreakpointProgrammatic,
  pasteElements,
  openContainer,
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
  changeElementInBreakpoint,
  openContainer,
  pasteElements,
  setElementsInBreakpoint,
  setSelectedElements,
  removeElementsFromBreakpoint,
  toggleSelectedElement,
].map((action) => action().type);

export const actionsToOmit = [
  addBreakpointSilent,
  setSelectedElement,
  setSelectedBreakpoint,
  setSidebarView,
  setSidebar,
  setElementsInBreakpointProgrammatic,
  updateBreakpointSilent,
].map((action) => action().type);

export const actions = [...actionsImportant, ...actionsToOmit];
