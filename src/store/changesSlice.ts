import { type Action, createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { createUniqueId } from '@/utils/createUniqueId';

import { actionsToOmit } from './changesActions';
import { CHANGES_START_TRANSACTION_TYPE, CHANGES_STOP_TRANSACTION_TYPE } from './changesTransactions';
import type { StateInitialChanges } from './store';

type Change = {
  action: Action<string>,
  key: string,
  time: number,
  elementsInBreakpoints?: boolean,
};

type ActionPushChange = PayloadAction<Change>;

type ActionType = typeof actionsToOmit[number];

type ActionCommit = PayloadAction<{ initial: unknown }>;

export type Changes = {
  history: Change[],
  index: number,
  initial: StateInitialChanges,
  pushKey: string,
  saved: boolean,
  undoKey: string,
};

export const initialState: Changes = {
  history: [],
  index: 0,
  initial: {},
  pushKey: '',
  saved: true,
  undoKey: '',
};

const findLastChangeIndex = (state: Changes, action: Action<string>): number => {
  if (action.type !== 'elementsInBreakpoints/setElementsInBreakpointProgrammatic') return -1;

  for (let i = state.history.length - 1; i >= 0; i--) {
    const change = state.history[i];
    if (change.elementsInBreakpoints) return i + 1;
  }
  return -1;
};

const pushChanges = (state: Changes, { payload: { action, key, time } }: ActionPushChange) => {
  state.history.length = state.index;

  const lastElementInBreakpointsIndex = findLastChangeIndex(state, action);
  if (lastElementInBreakpointsIndex >= 0) {
    state.history.splice(
      lastElementInBreakpointsIndex,
      0,
      {
        action,
        key,
        time,
        elementsInBreakpoints: true,
      },
    );
  } else {
    state.history.push({
      action,
      key,
      time,
      elementsInBreakpoints: action.type.startsWith('elementsInBreakpoints/'),
    });
  }

  state.index = state.history.length;
  state.saved = false;
  if (!actionsToOmit.includes(action.type as ActionType)) state.pushKey = createUniqueId();

  return state;
};

export const changesSlice = createSlice({
  name: 'changes',
  initialState,
  reducers: {
    pushChange: (state, action: ActionPushChange) => {
      pushChanges(state, action);
    },
    undoChanges: (state) => {
      let isTransactionType = false;
      let transactionFinalized = false;

      for (let i = state.index - 1; i >= 0; i--) {
        const { action, time } = state.history[i];
        const prevHistory = state.history[i - 1];

        state.index--;

        if (!transactionFinalized && !isTransactionType) {
          isTransactionType = action.type === CHANGES_STOP_TRANSACTION_TYPE;
        }

        if (isTransactionType) {
          if (action.type === CHANGES_START_TRANSACTION_TYPE) {
            isTransactionType = false;
            transactionFinalized = true;
            break;
          }
          continue;
        }

        if (prevHistory && prevHistory.action.type === 'elementsInBreakpoints/addElementToBreakpoint'
          && action.type === 'elementsInBreakpoints/setElementsInBreakpoint' && time - prevHistory.time < 1000) {
          continue;
        }

        if (prevHistory && prevHistory.action.type === 'pageSettings/updatePageSettings'
          && action.type === 'elementsInBreakpoints/setElementsInBreakpoint') {
          continue;
        }

        if (!actionsToOmit.includes(action.type as ActionType)) break;
      }
      state.saved = false;
      state.undoKey = createUniqueId();
    },
    redoChanges: (state) => {
      let isTransactionType = false;
      let transactionFinalized = false;

      state.undoKey = createUniqueId();
      for (let i = state.index; i < state.history.length; i++) {
        const { action, time } = state.history[i];
        state.index++;
        state.saved = false;

        if (!transactionFinalized && !isTransactionType) {
          isTransactionType = action.type === CHANGES_START_TRANSACTION_TYPE;
        }

        if (isTransactionType) {
          if (action.type === CHANGES_STOP_TRANSACTION_TYPE) {
            isTransactionType = false;
            transactionFinalized = true;
          }
          continue;
        }

        const next = state.history[i + 1];
        if (next && next.action.type === 'elementsInBreakpoints/setElementsInBreakpointProgrammatic') continue;
        if (next && next.action.type === 'elementsInBreakpoints/setElementsInBreakpoint'
          && action.type === 'elementsInBreakpoints/addElementToBreakpoint' && next.time - time < 1000) {
          continue;
        }

        if (next && next.action.type === 'elementsInBreakpoints/setElementsInBreakpoint'
        && action.type === 'pageSettings/updatePageSettings') {
          continue;
        }

        if (!actionsToOmit.includes(action.type as ActionType)) {
          return;
        }
      }
    },
    commitHistory: (_state, { payload: { initial } }: ActionCommit) => ({
      ...initialState,
      initial,
    }),
    setIsSaved: (state) => {
      state.saved = true;
      return state;
    },
  },
});

export const {
  pushChange,
  redoChanges,
  commitHistory,
  undoChanges,
  setIsSaved,
} = changesSlice.actions;

export default changesSlice.reducer;
