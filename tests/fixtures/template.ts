import { expect, Page } from '@playwright/test';

import { sleep } from './sleep';

export const waitForTemplate = async (page: Page) => {
  await expect(page.getByTestId('templateLoaderAnimation')).toHaveCount(0);
  await sleep(3000);
};
