import { Page } from '@playwright/test';

import { BreakpointDetails } from '../breakpoint/types';
import { getElementById, getElementDetails } from './elements';
import { sleep } from '../sleep';
import { getBreakpointZoom } from '../breakpoint/getBreakpointZoom';

export const resizeElement = async (
  page: Page,
  elementId: string,
  breakpointDetails: BreakpointDetails,
  nextWidth: number,
  type: 'fromLeft' | 'fromRight',
) => {
  const element = getElementById(page, elementId);
  const elementBox = await element.boundingBox();
  const elementDetails = await getElementDetails(page, element, breakpointDetails);

  const diff = elementDetails.w - nextWidth;
  if (!diff) return;

  let fromX: number;
  let toX: number;

  const zoom = await getBreakpointZoom(page, breakpointDetails);

  if (type === 'fromRight') {
    fromX = elementBox.x + elementBox.width - 2;
    toX = fromX - breakpointDetails.colWidth * zoom * diff;
  } else {
    fromX = elementBox.x + 2;
    toX = fromX + breakpointDetails.colWidth * zoom * diff;
  }

  await page.mouse.move(fromX, elementBox.y + 2);
  await page.mouse.down();
  await sleep(200);
  await page.mouse.move(toX, elementBox.y + 2, { steps: 10 });
  await sleep(200);
  await page.mouse.up();
  await sleep(500);
};

export const resizeElementFromLeft = (
  page: Page,
  elementId: string,
  breakpointDetails: BreakpointDetails,
  nextWidth: number,
) => resizeElement(page, elementId, breakpointDetails, nextWidth, 'fromLeft');

export const resizeElementFromRight = (
  page: Page,
  elementId: string,
  breakpointDetails: BreakpointDetails,
  nextWidth: number,
) => resizeElement(page, elementId, breakpointDetails, nextWidth, 'fromRight');
