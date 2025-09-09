import type { Page } from '@playwright/test';

import type { BreakpointDetails } from './types';

export const getBreakpointZoom = async (
  page: Page,
  breakpointDetails: Pick<BreakpointDetails, 'from' | 'padding'>,
) : Promise<number> => {
  const gridIn = page.locator('.react-panzoom__in');
  const gridInPosition = await gridIn.boundingBox();

  const breakpointWidth = breakpointDetails.from
    - breakpointDetails.padding.left - breakpointDetails.padding.right;
  const zoom = gridInPosition.width / breakpointWidth;

  return zoom;
};
