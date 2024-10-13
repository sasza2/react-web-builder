import {
  addBreakpoint, addBreakpointSilent, removeBreakpoint, updateBreakpoint, updateBreakpointSilent,
} from './breakpointsSlice';
import {
  addElementsToBreakpoint,
  addElementToBreakpoint,
  changeElementInBreakpoint,
  openContainer,
  pasteElements,
  removeElementsFromBreakpoint,
  setElementsInBreakpoint,
  setElementsInBreakpointProgrammatic,
} from './elementsInBreakpointsSlice';
import { updatePageSettings } from './pageSettingsSlice';
import { setSelectedBreakpoint } from './selectedBreakpointSlice';
import { setSelectedElement } from './selectedElementSlice';
import { setSelectedElements, toggleSelectedElement } from './selectedElementsSlice';
import { setSidebar, setSidebarView } from './sidebarSlice';

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
