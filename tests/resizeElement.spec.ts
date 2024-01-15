import { expect, test } from '@playwright/test';

import { createElement } from './fixtures/elements/createElement';
import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';
import { getBreakpointDetails } from './fixtures/breakpoint/getBreakpointDetails';
import { resizeElementFromLeft, resizeElementFromRight } from './fixtures/elements/resizeElement';
import { getElementById, getElementDetails } from './fixtures/elements/elements';

test('resize element', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);

  const breakpointDetails = await getBreakpointDetails(page);
  await page.getByTestId('sidebarBack').click();

  const elementId = await createElement(page, 'basic', 'Box', 1, breakpointDetails);

  await sleep(300);

  await resizeElementFromLeft(page, elementId, breakpointDetails, 6);
  await resizeElementFromRight(page, elementId, breakpointDetails, 2);

  const element = getElementById(page, elementId);
  const elementDetails = await getElementDetails(page, element, breakpointDetails);

  expect(elementDetails.w).toBe(2);
  expect(elementDetails.x).toBe(14);
  expect(elementDetails.y).toBe(1);
});
