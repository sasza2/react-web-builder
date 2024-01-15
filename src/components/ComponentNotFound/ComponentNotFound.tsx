import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyleProvider } from '../StyleProvider';
import { Label } from './ComponentNotFound.styled';

export function ComponentNotFound() {
  const { t } = useTranslation();
  return (
    <StyleProvider>
      <Label>{t('element.notFound')}</Label>
    </StyleProvider>
  );
}
