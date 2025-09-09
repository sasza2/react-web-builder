import type { Breakpoint } from 'types';

import type { IForm } from './types';

export const formToBreakpoint = (form: IForm): Omit<Breakpoint, 'id'> => ({
  from: parseInt(form.from),
  to: form.stretchToAvailableWidth ? null : parseInt(form.from),
  rowHeight: parseInt(form.rowHeight),
  cols: parseInt(form.cols),
  backgroundColor: form.backgroundColor,
  padding: form.padding,
});
