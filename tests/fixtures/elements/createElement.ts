import type { Page } from '@playwright/test';

import { getBreakpointZoom } from '../breakpoint/getBreakpointZoom';
import type { BreakpointDetails } from '../breakpoint/types';
import { gridReset } from '../grid';
import { openGroup } from '../openGroup';
import { sleep } from '../sleep';
import { getElementsIds } from './elements';

export const createElement = async (
  page: Page,
  groupId: string,
  componentId: string,
  row: number,
  breakpointDetails: BreakpointDetails,
) => {
  const prevElementsIds = await getElementsIds(page);

  await gridReset(page);
  await openGroup(page, groupId);

  const gridContainer = page.locator('.react-panzoom');
  const gridContainerPosition = await gridContainer.boundingBox();

  const gridContainerIn = page.locator('.react-panzoom__in');
  const gridContainerInPosition = await gridContainerIn.boundingBox();

  const componentElement = page.locator(`[data-testid*=SelectNewElement__component--${componentId}]`);
  const elementBox = await componentElement.boundingBox();

  const grabOffsetY = 10;

  const zoom = await getBreakpointZoom(page, breakpointDetails);

  const y = gridContainerPosition.y
    + breakpointDetails.rowHeight * zoom * row;

  await page.mouse.move(elementBox.x + 10, elementBox.y + grabOffsetY);
  await page.mouse.down();
  await sleep(100);
  await page.mouse.move(gridContainerInPosition.x, y, { steps: 20 });
  await sleep(100);
  await page.mouse.move(gridContainerInPosition.x, y);
  await sleep(400);
  await page.mouse.up();
  await sleep(200);

  const currentElementsIds = await getElementsIds(page);
  const nextElementId = currentElementsIds.reduce((prev, current) => {
    if (prev) return prev;
    if (!prevElementsIds.includes(current)) return current;
    return null;
  }, null);

  return nextElementId;
};
