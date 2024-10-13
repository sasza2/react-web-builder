import React from 'react';
import { useTranslation } from 'react-i18next';

import { LoaderSpinner } from '../LoaderSpinner';
import { StyleProvider } from '../StyleProvider';
import { Container, Label } from './ComponentIsLoading.styled';

export function ComponentIsLoading() {
  const { t } = useTranslation();
  return (
    <StyleProvider>
      <Container>
        <Label>{t('element.loading')}</Label>
        <LoaderSpinner />
      </Container>
    </StyleProvider>
  );
}
