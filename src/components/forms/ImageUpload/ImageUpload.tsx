import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnImageUpload } from 'types';

import { Input } from '../Input';
import { FileUpload } from './FileUpload';

type ImageUploadProps = {
  name: string,
  onImageUpload: OnImageUpload,
};

export function ImageUpload({
  name,
  onImageUpload,
}: ImageUploadProps) {
  const { t } = useTranslation();
  return (
    <>
      <Input
        name={`${name}.location`}
        testId="url"
        leftNode={t('element.link.url')}
      />
      <FileUpload
        name={name}
        onImageUpload={onImageUpload}
      />
    </>
  );
}
