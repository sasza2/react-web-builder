# Image upload
Feature for uploading images. Parameter is async function that takes file as argument and returns object with `location` and `upload` fields. `upload` field should contains any information about upload (could be just like in example if details are not available)

## Example

```jsx
import React from 'react';
import WebBuilder, { OnImageUpload, Page } from '../WebBuilder';

export function ImageUploadExample() {
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
        location: `http://localhost:3000/${json.location}`,
        upload: { status: 'ok' },
      };
    } catch (e) {
      throw new Error('error when uploading file');
    }
  };

  return (
    <WebBuilder
      onImageUpload={onImageUpload}
    />
  );
}
```
