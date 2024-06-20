import React from 'react';

import { ViewProps } from 'types';
import { PropertiesProvider } from '@/components/PropertiesProvider';
import { StyleProvider } from '@/components/StyleProvider';
import { I18nProvider } from './components/I18nProvider';
import { ViewRenderPage } from './components/View';
import { ViewElementContainer } from './components/ElementContainer/ViewElementContainer';
import { ComponentsProvider } from './components/ComponentsProvider';

function View(props: ViewProps) {
  return (
    <PropertiesProvider {...props}>
      <ComponentsProvider components={props.components} elementContainer={ViewElementContainer}>
        <StyleProvider>
          <I18nProvider>
            <ViewRenderPage />
          </I18nProvider>
        </StyleProvider>
      </ComponentsProvider>
    </PropertiesProvider>
  );
}

export default View;
