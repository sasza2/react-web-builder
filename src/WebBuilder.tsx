import React from 'react';

import { WebBuilderProps } from 'types';
import { ConfigurationProvider } from '@/components/ConfigurationProvider';
import { SidebarProvider } from '@/components/SidebarProvider';
import { WebBuilderPropertiesProvider } from '@/components/PropertiesProvider';
import { Grid } from '@/components/Grid';
import { GridAPIProvider } from '@/components/GridAPIProvider';
import { Sidebar } from '@/components/Sidebar';
import { Navbar, NavbarProvider } from '@/components/Navbar';
import { ElementsProvider } from '@/components/ElementsProvider';
import { StyleProvider } from '@/components/StyleProvider';
import { WebBuilderSizeProvider } from '@/components/WebBuilderSize';
import { BuilderHints } from './components/Hints';
import { AutoSave } from './components/AutoSave';
import { StoreProvider } from './store/StoreProvider';
import { LoadFont } from './LoadFont';
import { GlobalStyles } from './WebBuilder.styled';
import { I18nProvider } from './components/I18nProvider';
import { ToastContainer } from './components/ToastContainer';
import { BeforeUnload } from './components/BeforeUnload';
import { LoadTemplate } from './components/Grid/LoadTemplate/LoadTemplate';

function WebBuilder(props: WebBuilderProps) {
  return (
    <WebBuilderPropertiesProvider {...props}>
      <StoreProvider>
        <ConfigurationProvider>
          <GridAPIProvider>
            <ElementsProvider>
              <SidebarProvider>
                <WebBuilderSizeProvider>
                  <NavbarProvider>
                    <AutoSave>
                      <StyleProvider>
                        <I18nProvider>
                          <LoadTemplate>
                            <BeforeUnload />
                            <Navbar />
                            <Grid />
                            <Sidebar />
                            <BuilderHints />
                            <ToastContainer />
                          </LoadTemplate>
                        </I18nProvider>
                        <LoadFont />
                        <GlobalStyles />
                      </StyleProvider>
                    </AutoSave>
                  </NavbarProvider>
                </WebBuilderSizeProvider>
              </SidebarProvider>
            </ElementsProvider>
          </GridAPIProvider>
        </ConfigurationProvider>
      </StoreProvider>
    </WebBuilderPropertiesProvider>
  );
}

export default WebBuilder;
