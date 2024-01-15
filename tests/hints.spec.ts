import { test } from '@playwright/test';

import { goThroughHints } from './fixtures/goThroughHints';

test('go through hints', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);
});
