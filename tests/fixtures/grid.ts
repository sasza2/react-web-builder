import type { Page } from '@playwright/test';

import { sleep } from './sleep';

const gridZoom = async (page: Page, deltaY: number) => {
  const gridIn = page.locator('.react-panzoom');
  const gridInPosition = await gridIn.boundingBox();

  const gridContainerIn = page.locator('.react-panzoom__in');
  const gridContainerInPosition = await gridContainerIn.boundingBox();

  let prevWidth = Math.round(gridContainerInPosition.width);

  await page.mouse.move(gridInPosition.x + gridInPosition.width / 2, gridInPosition.y + 2);
  while (true) { // eslint-disable-line no-constant-condition
    await page.mouse.wheel(0, deltaY);
    await sleep(50);

    const gridCurrentContainerInPosition = await gridContainerIn.boundingBox();
    const currentWidth = Math.round(gridCurrentContainerInPosition.width);

    if (prevWidth === currentWidth) return;

    prevWidth = currentWidth;
  }
};

export const gridZoomOutMax = (page: Page) => gridZoom(page, 25);

export const gridZoomInMax = (page: Page) => gridZoom(page, -25);

export const gridReset = async (page: Page) => {
  await gridZoomOutMax(page);

  const gridContainerIn = page.locator('.react-panzoom');
  const gridContainerInPosition = await gridContainerIn.boundingBox();

  const gridIn = page.locator('.react-panzoom__in');
  const gridInPosition = await gridIn.boundingBox();

  let fromX: number;
  const toX = gridContainerInPosition.x - 1;

  if (gridInPosition.x > gridContainerInPosition.x) {
    fromX = gridInPosition.x - 1;
  } else {
    fromX = gridInPosition.x + gridInPosition.width + 1;
  }

  await page.mouse.move(fromX, gridInPosition.y);
  await page.mouse.down();
  await sleep(100);
  await page.mouse.move(toX, gridInPosition.y - (gridContainerInPosition.y - gridInPosition.y), { steps: 10 });
  await sleep(100);
  await page.mouse.up();
  await sleep(100);
};
