import { expect, test } from '@playwright/test';

import { template } from './consts';
import { checkBreakpointElements } from './fixtures/breakpoint/checkBreakpointElements';
import { selectBreakpoint } from './fixtures/breakpoint/selectBreakpoint';
import { goThroughHints } from './fixtures/goThroughHints';
import { saveAsDraft } from './fixtures/publish';
import { sleep } from './fixtures/sleep';
import { waitForTemplate } from './fixtures/template';

test('load template', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--templates-story');
  await goThroughHints(page);
  await waitForTemplate(page);

  await saveAsDraft(page);
  await page.reload();

  let didDisplayLoader: boolean = false;
  try {
    await expect(page.getByTestId('templateLoaderAnimation')).toHaveCount(1);
    didDisplayLoader = true;
  } catch (e) {
    expect(e).toBeTruthy();
    didDisplayLoader = false;
  }

  expect(didDisplayLoader).toBeFalsy();

  const gridIn = page.getByTestId('SelectNewElement');
  await gridIn.isEnabled();

  await checkBreakpointElements(page, template.default.desktop);

  await selectBreakpoint(page, 'breakpoint360');

  await sleep(3000);

  await checkBreakpointElements(page, template.default.mobile);

  await page.goto('/?mode=preview&story=view--published-story');

  const view = page.locator('.story-template');
  const textContent = await view.textContent();
  expect(textContent).toBe('Publish page with elements to make this visible');
});
