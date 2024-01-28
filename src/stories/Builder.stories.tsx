import React from 'react';

import { OnImageUpload, Page } from 'types';
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

  const onImageUpload: OnImageUpload = async (file: string | Blob) => {
    const data = new FormData();
    data.append('sampleFile', file);

    try {
      const promise = await fetch('http://localhost:3000/upload', {
        method: 'post',
        body: data,
      });
      const json = await promise.json() as { location: string };
      return {
        location: `http://localhost:37437/${json.location}`,
        upload: { status: true },
      };
    } catch (e) {
      throw new Error('error when uploading file');
    }
  };

  const page = JSON.parse(localStorage.getItem('page-builder-draft')) as Page;
  return (
    <WebBuilder
      page={page}
      onAutoSave={onSaveAsDraft}
      onImageUpload={onImageUpload}
      onPublish={onPublish}
      onSaveAsDraft={onSaveAsDraft}
      fonts={fonts}
    />
  );
}
