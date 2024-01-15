import { expect, test } from '@playwright/test';

import { createElement } from './fixtures/elements/createElement';
import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';
import { getBreakpointDetails } from './fixtures/breakpoint/getBreakpointDetails';
import { checkBreakpointElements } from './fixtures/breakpoint/checkBreakpointElements';
import { getElements } from './fixtures/elements/elements';

test('add elements', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);

  const breakpointDetails = await getBreakpointDetails(page);
  await page.getByTestId('sidebarBack').click();

  const elementA = await createElement(page, 'basic', 'Box', 1, breakpointDetails);
  const elementB = await createElement(page, 'basic', 'Box', 20, breakpointDetails);
  const elementC = await createElement(page, 'basic', 'Box', 40, breakpointDetails);

  await sleep(300);

  const elements = await getElements(page);

  expect(elements.length).toBe(3);

  const expectedElements = [
    {
      id: elementA, w: breakpointDetails.cols, h: 4, x: 0, y: 1,
    },
    {
      id: elementB, w: breakpointDetails.cols, h: 4, x: 0, y: 20,
    },
    {
      id: elementC, w: breakpointDetails.cols, h: 4, x: 0, y: 40,
    },
  ];

  await checkBreakpointElements(page, expectedElements);
});
