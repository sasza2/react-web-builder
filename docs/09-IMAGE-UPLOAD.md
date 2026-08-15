# Image upload

`onImageUpload` connects the builder's image fields to your own storage. It is an async function that receives the selected file and resolves to an object with `location` and `upload`.

- `location` - the URL the image will be rendered from
- `upload` - any information you want to keep about the upload; it is stored in the [page](./02-PAGE.md) alongside the location. If your backend returns no details, a simple marker object is enough

It applies to every image field: the built-in Image component, the [`img`](./01-COMPONENTS.md#img) property type and background images. Without it, users can still paste an image URL by hand.

## Example

```tsx
import React from 'react';
import WebBuilder, { OnImageUpload, Page } from 'react-web-builder';

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

## Uploading to S3 with a presigned URL

A common production setup: ask your backend for a presigned URL, `PUT` the file straight to the bucket, and return the public location.

```tsx
const onImageUpload: OnImageUpload = async (file) => {
  const blob = file as File;

  const res = await fetch('/api/uploads/sign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ filename: blob.name, contentType: blob.type }),
  });
  if (!res.ok) throw new Error('Could not prepare the upload');

  const { uploadUrl, publicUrl, key } = await res.json();

  const upload = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': blob.type },
    body: blob,
  });
  if (!upload.ok) throw new Error('Upload failed');

  return {
    location: publicUrl,
    upload: { key, size: blob.size, uploadedAt: new Date().toISOString() },
  };
};
```

## Notes

- **Throw on failure.** A rejected promise is how the builder learns the upload did not succeed; returning an object with an empty `location` leaves a broken image in the page.
- **Validate before uploading.** Size and MIME checks belong in this callback, where you can throw a message that is meaningful to the user.
- **Return absolute or root-relative URLs.** The editor renders the grid inside an iframe, so URLs relative to the current path may not resolve the way you expect.
- **URLs live in the saved page.** If your storage produces expiring links, keep a stable `location` and rewrite it at render time with [`transformElementProperty`](./01-COMPONENTS.md#transform-properties) instead of storing a signed URL.
