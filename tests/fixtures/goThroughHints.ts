import { expect, type Page } from '@playwright/test';

import en from '../../src/locales/en';
import { sleep } from './sleep';

const HINTS = [
  en.hints.addNewElement,
  en.hints.changeBreakpoint,
  en.hints.configuration,
  en.hints.preview,
  en.hints.saveOrPublish,
];

export const goThroughHints = async (page: Page) => {
  for await (const hint of HINTS) { // eslint-disable-line no-restricted-syntax
    const element = page.getByTestId('HelperArrow__title');
    const text = await element.innerText();
    expect(text).toStrictEqual(hint);

    const button = page.getByTestId('HelperArrow__button');
    await button.click();

    await sleep(300);
  }
};
