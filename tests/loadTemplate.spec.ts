import { expect, test } from '@playwright/test';

import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';
import { checkBreakpointElements } from './fixtures/breakpoint/checkBreakpointElements';
import { selectBreakpoint } from './fixtures/breakpoint/selectBreakpoint';
import { template } from './consts';

test('load template', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--templates-story');
  await goThroughHints(page);

  await expect(page.locator('templateLoaderAnimation')).toHaveCount(0);

  await sleep(500);

  await checkBreakpointElements(page, template.default.desktop);

  await selectBreakpoint(page, 'breakpoint360');

  await sleep(3000);

  await checkBreakpointElements(page, template.default.mobile);
});
