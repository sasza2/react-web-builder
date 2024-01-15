import React from 'react';

import { Page } from 'types';
import WebBuilder from '../WebBuilder';
import { fonts } from './consts';

export default { title: 'WebBuilder' };

export function WebBuilderStory() {
  const onPublish = (nextPage: Page) => new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('page-builder-published', JSON.stringify(nextPage));
      resolve(undefined);
    }, 2000);
  });

  const onSaveAsDraft = (nextPage: Page) => new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem('page-builder-draft', JSON.stringify(nextPage));
      resolve(undefined);
    }, 2000);
  });

  const page = JSON.parse(localStorage.getItem('page-builder-draft')) as Page;
  return (
    <WebBuilder
      page={page}
      onAutoSave={onSaveAsDraft}
      onPublish={onPublish}
      onSaveAsDraft={onSaveAsDraft}
      fonts={fonts}
    />
  );
}
