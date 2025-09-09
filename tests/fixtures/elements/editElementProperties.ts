import type { Page } from '@playwright/test';

import { getElementById } from './elements';

export const editElementProperties = async (page: Page, elementId: string) => {
  const element = getElementById(page, elementId);
  await element.click();
};
