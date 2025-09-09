import { type Action, configureStore, type Middleware } from '@reduxjs/toolkit';

import { createUniqueId } from '@/utils/createUniqueId';

import { replaceBreakpoints } from './breakpointsSlice';
import { actions } from './changesActions';
import { pushChange } from './changesSlice';
import { replaceElementsInBreakpoint } from './elementsInBreakpointsSlice';
import { replacePageSettings } from './pageSettingsSlice';
import reducer from './reducer';
import { replaceBreakpoint } from './selectedBreakpointSlice';
import { replaceSelectedElement } from './selectedElementSlice';
import { replaceSelectedElements } from './selectedElementsSlice';
import { replaceSidebar } from './sidebarSlice';
import type { RootState, Store } from './store';

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
    id: nextState.selectedBreakpoint,
  }));
  store.dispatch(replaceSelectedElement({
    elementId: nextState.selectedElement,
  }));
  store.dispatch(replaceSidebar(nextState.sidebar));
  store.dispatch(replacePageSettings(nextState.pageSettings));
  store.dispatch(replaceSelectedElements({
    elementsIds: nextState.selectedElements,
  }));
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
    store.dispatch(pushChange({ key: createUniqueId(), action, time: Date.now() }));
  }
};

export default changesMiddleware;
