import React from 'react';
import { useTranslation } from 'react-i18next';

import { Toggle } from '@/components/forms/Toggle';
import { useConfiguration, useSetConfiguration } from '@/components/ConfigurationProvider';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarView } from '../SidebarProvider/SidebarProvider';
import { FormGroup, FormHeader } from '../forms/FormControl.styled';
import { RangeSlider } from '../forms/RangeSlider';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { FormProvider } from '../FormProvider/FormProvider';
import { ConfigurationContainer } from './Configuration.styled';
import { ShowHelperTips } from './ShowHelperTips';

export function Configuration() {
  const { t } = useTranslation();
  const configuration = useConfiguration();
  const setConfiguration = useSetConfiguration();
  const setSidebarView = useSetSidebarView();

  const getFormValues = () => configuration;

  const onBack = () => {
    setSidebarView(SidebarView.AddElement);
  };

  return (
    <>
      <SidebarHeader onBack={onBack}>
        {t('configuration.title')}
      </SidebarHeader>
      <SidebarScrollbar>
        <ConfigurationContainer>
          <FormGroup>
            <FormHeader>
              {t('configuration.autoSave.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="autoSave"
                label={t('configuration.autoSave.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.mouseWheel.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="panZoomScroll"
                label={t('configuration.mouseWheel.description')}
              />
            </FormProvider>
          </FormGroup>
          {
            configuration.panZoomScroll && (
              <FormGroup>
                <FormHeader>
                  {t('configuration.mouseWheelSpeed.title')}
                </FormHeader>
                <FormProvider
                  getFormValues={getFormValues}
                  setForm={setConfiguration}
                >
                  <RangeSlider
                    name="scrollSpeed"
                    min={0}
                    max={9}
                  />
                </FormProvider>
              </FormGroup>
            )
          }
          <FormGroup>
            <FormHeader>
              {t('configuration.gridZooming.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="gridZoomingInCenter"
                label={t('configuration.gridZooming.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.helpLines.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="helpLines"
                label={t('configuration.helpLines.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.bringElementsAbove.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="bringElementsAbove"
                label={t('configuration.bringElementsAbove.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.editOnDoubleClick.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="editOnDoubleClick"
                label={t('configuration.editOnDoubleClick.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.preventCloseEditOnClick.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="preventCloseEditOnClick"
                label={t('configuration.preventCloseEditOnClick.description')}
              />
            </FormProvider>
          </FormGroup>
          <FormGroup>
            <FormHeader>
              {t('configuration.autoFocusRichTextInEditProperties.title')}
            </FormHeader>
            <FormProvider
              getFormValues={getFormValues}
              setForm={setConfiguration}
            >
              <Toggle
                name="autoFocusRichTextInEditProperties"
                label={t('configuration.autoFocusRichTextInEditProperties.description')}
              />
            </FormProvider>
          </FormGroup>
          <ShowHelperTips />
        </ConfigurationContainer>
      </SidebarScrollbar>
    </>
  );
}
