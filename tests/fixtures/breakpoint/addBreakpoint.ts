import { Page } from '@playwright/test';
import { selectBreakpoint } from './selectBreakpoint';
import { sleep } from '../sleep';

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
