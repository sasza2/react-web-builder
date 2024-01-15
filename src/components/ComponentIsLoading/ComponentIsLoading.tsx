import React from 'react';
import { useTranslation } from 'react-i18next';

import { Loader as LoaderIcon } from '../icons/Loader';
import { StyleProvider } from '../StyleProvider';
import { Container, Label, Loader } from './ComponentIsLoading.styled';

export function ComponentIsLoading() {
  const { t } = useTranslation();
  return (
    <StyleProvider>
      <Container>
        <Label>{t('element.loading')}</Label>
        <Loader>
          <LoaderIcon />
        </Loader>
      </Container>
    </StyleProvider>
  );
}
