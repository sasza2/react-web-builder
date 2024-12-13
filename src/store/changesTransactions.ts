import { Action } from '@reduxjs/toolkit';

export const CHANGES_START_TRANSACTION_TYPE = 'changesStartTransaction';

export const CHANGES_STOP_TRANSACTION_TYPE = 'changesStopTransaction';

export const changesStartTransaction = (): Action<typeof CHANGES_START_TRANSACTION_TYPE> => ({
  type: CHANGES_START_TRANSACTION_TYPE,
});

export const changesStopTransaction = (): Action<typeof CHANGES_STOP_TRANSACTION_TYPE> => ({
  type: CHANGES_STOP_TRANSACTION_TYPE,
});
