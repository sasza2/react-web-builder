import {
  AnyAction, configureStore, StateFromReducersMapObject, ThunkDispatch,
  Tuple,
} from '@reduxjs/toolkit';
import { Breakpoint, ElementsInBreakpoints, PageSettings } from 'types';

import changesMiddleware from './changesMiddleware';
import reducer from './reducer';

type PreloadedState = Partial<StateFromReducersMapObject<typeof reducer>>;

export const createStore = (preloadedState: PreloadedState) => configureStore({
  reducer,
  middleware: (getDefaultMiddleware) => {
    const defaultMiddleware = getDefaultMiddleware();
    return new Tuple(changesMiddleware, ...defaultMiddleware);
  },
  preloadedState,
});

export type Store = ReturnType<typeof createStore>;

export type GetState = Store['getState'];

export type RootState = ReturnType<GetState>;

export type AppDispatch = ThunkDispatch<RootState, void, AnyAction>;

export type StateInitialChanges = Partial<{
  breakpoints: Breakpoint[],
  elementsInBreakpoints: ElementsInBreakpoints,
  selectedBreakpoint: string | null,
  selectedElements: Array<string | number>,
  pageSettings: PageSettings,
}>;
