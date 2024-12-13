export const CHANGES_START_TRANSACTION_TYPE = 'changesStartTransaction';

export const CHANGES_STOP_TRANSACTION_TYPE = 'changesStopTransaction';

export const changesStartTransaction = () => ({ type: CHANGES_START_TRANSACTION_TYPE });

export const changesStopTransaction = () => ({ type: CHANGES_STOP_TRANSACTION_TYPE });
