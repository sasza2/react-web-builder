import breakpointsSliceReducer from './breakpointsSlice';
import changesSliceReducer from './changesSlice';
import elementsInBreakpointsReducer from './elementsInBreakpointsSlice';
import pageSettingsReducer from './pageSettingsSlice';
import selectedBreakpointReducer from './selectedBreakpointSlice';
import selectedElementReducer from './selectedElementSlice';
import sidebarReducer from './sidebarSlice';

const reducer = {
  breakpoints: breakpointsSliceReducer,
  changes: changesSliceReducer,
  elementsInBreakpoints: elementsInBreakpointsReducer,
  pageSettings: pageSettingsReducer,
  selectedBreakpoint: selectedBreakpointReducer,
  selectedElement: selectedElementReducer,
  sidebar: sidebarReducer,
};

export default reducer;
