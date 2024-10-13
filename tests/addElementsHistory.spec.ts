import { expect, test } from '@playwright/test';

import { getBreakpointDetails } from './fixtures/breakpoint/getBreakpointDetails';
import { createElement } from './fixtures/elements/createElement';
import { getElements } from './fixtures/elements/elements';
import { goThroughHints } from './fixtures/goThroughHints';
import { sleep } from './fixtures/sleep';

test('add elements history (undo/redo)', async ({ page }) => {
  await page.goto('/?mode=preview&story=webbuilder--web-builder-story');
  await goThroughHints(page);

  const historyUndo = page.getByTestId('historyUndo');
  const historyRedo = page.getByTestId('historyRedo');

  expect(await historyUndo.isDisabled()).toBeTruthy();
  expect(await historyRedo.isDisabled()).toBeTruthy();

  const breakpointDetails = await getBreakpointDetails(page);
  await page.getByTestId('sidebarBack').click();

  await historyUndo.click();

  expect(await historyUndo.isDisabled()).toBeTruthy();
  expect(await historyRedo.isDisabled()).toBeFalsy();

  await createElement(page, 'basic', 'Box', 1, breakpointDetails);
  await createElement(page, 'basic', 'Box', 20, breakpointDetails);
  await createElement(page, 'basic', 'Box', 40, breakpointDetails);

  await sleep(300);

  let elements = await getElements(page);
  expect(elements.length).toBe(3);

  for (let i = 1; i <= 3; i++) {
    await historyUndo.click();
    await sleep(100);
    elements = await getElements(page);
    expect(elements.length).toBe(3 - i);
  }

  expect(await historyUndo.isDisabled()).toBeTruthy();

  for (let i = 1; i <= 3; i++) {
    expect(await historyRedo.isDisabled()).toBeFalsy();
    await historyRedo.click();

    elements = await getElements(page);
    expect(elements.length).toBe(i);
    expect(await historyUndo.isDisabled()).toBeFalsy();
  }

  expect(await historyRedo.isDisabled()).toBeTruthy();

  elements = await getElements(page);
  expect(elements.length).toBe(3);
});
