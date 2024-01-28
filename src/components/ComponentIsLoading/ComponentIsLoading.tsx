import React from 'react';
import { useTranslation } from 'react-i18next';

import { StyleProvider } from '../StyleProvider';
import { Container, Label } from './ComponentIsLoading.styled';
import { LoaderSpinner } from '../LoaderSpinner';

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
