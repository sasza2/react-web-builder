import { Page, expect } from '@playwright/test';

import { sleep } from './sleep';

export const saveAsDraft = async (page: Page) => {
  const publishButton = page.getByTestId('publishButton');
  await publishButton.click();

  const saveAsDraftOption = page.getByTestId('saveAsDraft');
  await saveAsDraftOption.click();

  const toastify = page.locator('.Toastify');
  await expect(toastify.getByText('Waiting for save')).toBeVisible();
  await expect(toastify.getByText('Page is saved')).toBeVisible();

  await sleep(500);
};

export const publish = async (page: Page) => {
  const publishButton = page.getByTestId('publishButton');
  await publishButton.click();

  const saveAndPublish = page.getByTestId('saveAndPublish');
  await saveAndPublish.click();

  const toastify = page.locator('.Toastify');
  await expect(toastify.getByText('Waiting for publish')).toBeVisible();
  await expect(toastify.getByText('Page is saved and published')).toBeVisible();

  await sleep(500);
};
