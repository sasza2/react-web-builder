import { Action, Middleware, configureStore } from '@reduxjs/toolkit';

import { actions } from './changesActions';
import { pushChange } from './changesSlice';
import { replaceBreakpoints } from './breakpointsSlice';
import { replaceElementsInBreakpoint } from './elementsInBreakpointsSlice';
import { replacePageSettings } from './pageSettingsSlice';
import { replaceBreakpoint } from './selectedBreakpointSlice';
import { replaceSelectedElement } from './selectedElementSlice';
import { replaceSidebar } from './sidebarSlice';
import { RootState, Store } from './store';
import reducer from './reducer';

function updateStore(store: Store) {
  const temporaryReducer = {
    ...reducer,
  };
  const state = store.getState();
  const preloadedState = { ...state.changes.initial } as RootState;
  delete preloadedState.changes;

  delete temporaryReducer.changes;
  const temporaryStore = configureStore({
    reducer: temporaryReducer,
    preloadedState,
  });

  for (let i = 0; i < state.changes.index; i++) {
    const { action } = state.changes.history[i];
    temporaryStore.dispatch(action);
  }

  const nextState = temporaryStore.getState();
  store.dispatch(replaceBreakpoints({
    breakpoints: nextState.breakpoints,
  }));
  store.dispatch(replaceElementsInBreakpoint({
    elementsInBreakpoints: nextState.elementsInBreakpoints,
  }));
  store.dispatch(replaceBreakpoint({
    breakpointId: nextState.selectedBreakpoint,
  }));
  store.dispatch(replaceSelectedElement({
    elementId: nextState.selectedElement,
  }));
  store.dispatch(replaceSidebar(nextState.sidebar));
  store.dispatch(replacePageSettings(nextState.pageSettings));
}

type ActionName = typeof actions[number]
  | 'changes/pushChange'
  | 'changes/undoChanges'
  | 'changes/redoChanges';

const changesMiddleware: Middleware = (store: Store) => (next) => (action: Action<ActionName>) => {
  if (action.type === 'changes/pushChange') {
    return next(action);
  }

  if (action.type === 'changes/undoChanges' || action.type === 'changes/redoChanges') {
    next(action);
    updateStore(store);
    return;
  }

  next(action);

  if (actions.includes(action.type)) {
    store.dispatch(pushChange({ action, time: new Date().getTime() }));
  }
};

export default changesMiddleware;
