import breakpointsSliceReducer from './breakpointsSlice';
import changesSliceReducer from './changesSlice';
import elementsInBreakpointsReducer from './elementsInBreakpointsSlice';
import pageSettingsReducer from './pageSettingsSlice';
import selectedBreakpointReducer from './selectedBreakpointSlice';
import selectedElementReducer from './selectedElementSlice';
import selectedElementsReducer from './selectedElementsSlice';
import sidebarReducer from './sidebarSlice';

const reducer = {
  breakpoints: breakpointsSliceReducer,
  changes: changesSliceReducer,
  elementsInBreakpoints: elementsInBreakpointsReducer,
  pageSettings: pageSettingsReducer,
  selectedBreakpoint: selectedBreakpointReducer,
  selectedElement: selectedElementReducer,
  selectedElements: selectedElementsReducer,
  sidebar: sidebarReducer,
};

export default reducer;
