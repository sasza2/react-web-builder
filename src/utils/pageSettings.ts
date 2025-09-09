import type { Page, PageSettings } from 'types';

export const getPageSettings = (page: PageSettings): PageSettings => {
  const clearPage = {
    ...page,
  } as Page;

  delete clearPage.breakpoints;
  delete clearPage.elementsInBreakpoints;
  delete clearPage.elementsExtras;

  return clearPage as PageSettings;
};
