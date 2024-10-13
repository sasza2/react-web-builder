import React from 'react';
import { Page } from 'types';

import View from '../View';

export default { title: 'View' };

export function PublishedStory() {
  const page = JSON.parse(localStorage.getItem('page-builder-published')) as Page;
  if (!page) {
    return (
      <h1 className="story-template">Publish page with elements to make this visible</h1>
    );
  }
  return (
    <div className="story-template">
      { page && <View page={page} components={[]} /> }
    </div>
  );
}
