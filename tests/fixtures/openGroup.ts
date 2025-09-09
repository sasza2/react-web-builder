import type { Page } from '@playwright/test';

import { sleep } from './sleep';

export const openGroup = async (page: Page, groupId: string) => {
  const group = page.locator(`[data-testid*=SelectNewElement__group--${groupId}]`);
  const ariaExpanded = await group.getAttribute('aria-expanded');
  const isExpanded = ariaExpanded === 'true';
  if (isExpanded) return;

  await group.click();
  await sleep(300);
};
