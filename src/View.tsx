import React from 'react';
import { ViewProps } from 'types';

import { PropertiesProvider } from '@/components/PropertiesProvider';
import { StyleProvider } from '@/components/StyleProvider';

import { ComponentsProvider } from './components/ComponentsProvider';
import { ViewElementAnchor } from './components/ElementAnchor/ViewElementAnchor';
import { ViewElementContainer } from './components/ElementContainer/ViewElementContainer';
import { I18nProvider } from './components/I18nProvider';
import { ViewRenderPage } from './components/View';
import { ViewGlobalStyles } from './View.styled';

function View(props: ViewProps) {
  return (
    <PropertiesProvider {...props}>
      <ComponentsProvider {...props} components={props.components} elementAnchor={ViewElementAnchor} elementContainer={ViewElementContainer}>
        <StyleProvider>
          <I18nProvider>
            <ViewRenderPage />
            <ViewGlobalStyles />
          </I18nProvider>
        </StyleProvider>
      </ComponentsProvider>
    </PropertiesProvider>
  );
}

export default View;
