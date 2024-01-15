import { expect, test } from '@playwright/test';

import { createElement } from './fixtures/elements/createElement';
import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';
import { getBreakpointDetails } from './fixtures/breakpoint/getBreakpointDetails';
import { getElementById } from './fixtures/elements/elements';
import { editField } from './fixtures/form';
import { getStyle } from './fixtures/getStyle';
import { toSnapshot } from './fixtures/snapshot';

test('add text element', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);

  const breakpointDetails = await getBreakpointDetails(page);
  await page.getByTestId('sidebarBack').click();

  const elementId = await createElement(page, 'basic', 'Box', 1, breakpointDetails);

  expect(elementId).toBeTruthy();

  const element = getElementById(page, elementId);
  await element.click();

  const properties = page.getByTestId('properties');

  await sleep(2000);

  await editField(properties, 'Content', [
    { type: 'removeAll' },
    { type: 'click', mark: 'bold' },
    { type: 'fill', text: 'teeest' },
    { type: 'click', mark: 'bold' },
    { type: 'fill', text: 'qwerty' },
  ]);

  await editField(properties, 'Padding', {
    left: 10,
    top: 15,
    right: 20,
    bottom: 25,
  });

  await editField(properties, 'Background color', '#DA4E11');

  await editField(properties, 'Border', {
    left: 1,
    top: 2,
    right: 3,
    bottom: 4,
    color: '#217D48',
    radius: 3,
  });

  await sleep(500);

  const elementIn = element.locator('.react-web-builder-component-box');

  const backgroundColor = await getStyle(elementIn, 'background-color');
  expect(backgroundColor).toBe('rgb(218, 78, 17)');

  const borderTop = await getStyle(elementIn, 'border-top');
  expect(borderTop).toBe('2px solid rgb(33, 125, 72)');

  const borderRight = await getStyle(elementIn, 'border-right');
  expect(borderRight).toBe('3px solid rgb(33, 125, 72)');

  const borderBottom = await getStyle(elementIn, 'border-bottom');
  expect(borderBottom).toBe('4px solid rgb(33, 125, 72)');

  const borderLeft = await getStyle(elementIn, 'border-left');
  expect(borderLeft).toBe('1px solid rgb(33, 125, 72)');

  const borderRadius = await getStyle(elementIn, 'border-radius');
  expect(borderRadius).toBe('3px');

  const padding = await getStyle(elementIn, 'padding');
  expect(padding).toBe('15px 20px 25px 10px');

  expect(await toSnapshot(elementIn)).toMatchSnapshot('addTextElement.txt');
});
