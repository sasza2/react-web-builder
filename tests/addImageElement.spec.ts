import { expect, test } from '@playwright/test';

import { getBreakpointDetails } from './fixtures/breakpoint/getBreakpointDetails';
import { createElement } from './fixtures/elements/createElement';
import { getElementById } from './fixtures/elements/elements';
import { editField } from './fixtures/form';
import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';
import { toSnapshot } from './fixtures/snapshot';

const IMG_SRC = 'https://raw.githubusercontent.com/sasza2/react-grid-panzoom/master/docs/preview.gif';
const LINK_DESTINATION = 'https://github.com/sasza2/react-grid-panzoom';

test('add image element', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);

  const breakpointDetails = await getBreakpointDetails(page);
  await page.getByTestId('sidebarBack').click();

  const elementId = await createElement(page, 'basic', 'Image', 5, breakpointDetails);

  expect(elementId).toBeTruthy();

  const element = getElementById(page, elementId);
  await element.click();

  const properties = page.getByTestId('properties');
  const elementIn = element.getByTestId('component');

  await editField(
    properties,
    'Image source',
    IMG_SRC,
  );

  await sleep(500);

  expect(await toSnapshot(elementIn)).toMatchSnapshot('addImageElement.txt');

  await editField(
    properties,
    'Link destination',
    LINK_DESTINATION,
  );

  await sleep(500);

  expect(await toSnapshot(elementIn)).toMatchSnapshot('addImageElementWithLink.txt');

  const img = elementIn.locator('img');
  expect(await img.getAttribute('src')).toBe(IMG_SRC);

  const link = elementIn.locator('a');
  expect(await link.getAttribute('href')).toBe(LINK_DESTINATION);
});
