import React from 'react';
import { Page } from 'types';

import View from '../View';
import { fonts } from './consts';

export function Published() {
  const page = JSON.parse(localStorage.getItem('page-builder-published')) as Page;
  if (!page) {
    return (
      <h1 className="story-template">Publish page with elements to make this visible</h1>
    );
  }
  return (
    <div className="story-template">
      { page && (
      <View
        fonts={fonts}
        page={page}
        components={[]}
      />
      ) }
    </div>
  );
}

const meta = {
  component: Published,
  parameters: {
    layout: 'fullscreen',
    options: { showPanel: false },
  },
  title: 'WebBuilder/Published',
};

export default meta;
