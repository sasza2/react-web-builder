import { Page } from '@playwright/test';

import { sleep } from '../sleep';
import { selectBreakpoint } from './selectBreakpoint';

type Options = {
  from: number,
};

export const addBreakpoint = async (page: Page, options: Options) => {
  await selectBreakpoint(page, 'breakpointAdd');

  const sidebar = page.getByTestId('sidebar');
  const from = sidebar.getByTestId('from');

  await from.fill(`${options.from}`);

  const breakpointAddButton = page.getByTestId('breakpointAddButton');
  await breakpointAddButton.click();

  await sleep(200);
};
