import React from 'react';
import type { OnImageUpload, Page } from 'types';

import { delay } from '@/utils/delay';

import WebBuilder from '../WebBuilder';
import { fonts } from './consts';

export function Builder() {
  const onPublish = (nextPage: Page) => new Promise((resolve) => {
    localStorage.setItem('page-builder-published', JSON.stringify(nextPage));
    window.parent.location = '/?path=/story/webbuilder-published--published';
    resolve(null);
  });

  const onSaveAsDraft = async (nextPage: Page) => {
    await delay(100); // fake backend delay
    localStorage.setItem('page-builder-draft', JSON.stringify(nextPage));
  };

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
    } catch (_e) {
      throw new Error('error when uploading file');
    }
  };

  const page = JSON.parse(localStorage.getItem('page-builder-draft')) as Page;
  return (
    <WebBuilder
      enableDownload
      enableUpload
      page={page}
      onAutoSave={onSaveAsDraft}
      onImageUpload={onImageUpload}
      onPublish={onPublish}
      onSaveAsDraft={onSaveAsDraft}
      fonts={fonts}
    />
  );
}

const meta = {
  component: Builder,
  parameters: {
    layout: 'fullscreen',
  },
  title: 'WebBuilder/Builder',
};

export default meta;
