import type { Locator, Page } from '@playwright/test';

import { getBreakpointZoom } from '../breakpoint/getBreakpointZoom';
import type { BreakpointDetails } from '../breakpoint/types';

export type ElementDetails = {
  id: string,
  x: number,
  y: number,
  w: number,
  h: number,
};

export const getElements = async (page: Page) => {
  const elements = await page.locator('.react-panzoom-element:not(.react-panzoom-element-is-shadow)').all();
  return elements;
};

const getElementIdByLocator = async (element: Locator): Promise<string | null> => {
  const classNames = await element.getAttribute('class');
  const classList = classNames.split(' ');
  const idClassName = classList.find((className) => className.startsWith('react-panzoom-element--id-'));
  if (!idClassName) return;

  const [, id] = idClassName.split('--id-');
  if (!id) return null;

  return id;
};

export const getElementsIds = async (page: Page): Promise<string[]> => {
  const elements = await getElements(page);
  const ids: string[] = [];

  for await (const element of elements) { // eslint-disable-line no-restricted-syntax
    const id = await getElementIdByLocator(element);
    ids.push(id);
  }

  return ids;
};

export const getElementById = (page: Page, id: string): Locator => {
  const element = page.locator(`.react-panzoom-element--id-${id}`).first();
  return element;
};

export const getElementDetails = async (
  page: Page,
  element: Locator,
  breakpointDetails: BreakpointDetails,
): Promise<ElementDetails> => {
  const gridIn = page.locator('.react-panzoom__in');
  const gridInPosition = await gridIn.boundingBox();

  const elementPosition = await element.boundingBox();
  const zoom = await getBreakpointZoom(page, breakpointDetails);

  const roundHeight = (value: number) => Math.ceil(Math.floor(value * 10000) / 10000);

  const width = Math.round(elementPosition.width / gridInPosition.width * breakpointDetails.cols);
  const height = roundHeight(elementPosition.height / (breakpointDetails.rowHeight * zoom));
  const top = Math.round((elementPosition.y - gridInPosition.y) / (breakpointDetails.rowHeight * zoom));
  const left = Math.round((elementPosition.x - gridInPosition.x) / gridInPosition.width * breakpointDetails.cols);

  const id = await getElementIdByLocator(element);

  return {
    id,
    w: width,
    h: height,
    x: left,
    y: top,
  };
};
