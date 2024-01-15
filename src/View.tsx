import React from 'react';

import { ViewProps } from 'types';
import { ViewPropertiesProvider } from '@/components/PropertiesProvider';
import { StyleProvider } from '@/components/StyleProvider';
import { I18nProvider } from './components/I18nProvider';
import { ViewRenderPage } from './components/View';

function View(props: ViewProps) {
  return (
    <ViewPropertiesProvider {...props}>
      <StyleProvider>
        <I18nProvider>
          <ViewRenderPage />
        </I18nProvider>
      </StyleProvider>
    </ViewPropertiesProvider>
  );
}

export default View;
