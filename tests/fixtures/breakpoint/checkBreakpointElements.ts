import { Page, expect } from '@playwright/test';

import { getBreakpointDetails } from './getBreakpointDetails';
import { ElementDetails, getElementDetails, getElements } from '../elements/elements';

export const checkBreakpointElements = async (
  page: Page,
  expectedElements: ElementDetails[],
) => {
  const expectedElementsMap: Record<string, ElementDetails> = {};
  expectedElements.forEach((expectedElement) => {
    expectedElementsMap[expectedElement.id] = expectedElement;
  });

  const elements = await getElements(page);

  expect(elements).toHaveLength(expectedElements.length);

  const breakpointDetails = await getBreakpointDetails(page);

  for await (const element of elements) { // eslint-disable-line no-restricted-syntax
    const elementDetails = await getElementDetails(page, element, breakpointDetails);
    expect(elementDetails).toBeTruthy();
    expect(elementDetails).toStrictEqual(expectedElementsMap[elementDetails.id]);
  }
};
