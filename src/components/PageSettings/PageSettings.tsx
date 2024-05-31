import React from 'react';
import { useTranslation } from 'react-i18next';

import { PageSettings as IPageSettings } from 'types';
import { Select } from '@/components/forms/Select';
import { usePageSettings } from '@/hooks/usePageSettings';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';
import { assignTestProp } from '@/utils/tests';
import { useAppSelector } from '@/store/useAppSelector';
import { useAppDispatch } from '@/store/useAppDispatch';
import { updatePageSettings } from '@/store/pageSettingsSlice';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { FormProvider } from '../FormProvider';
import { FormGroup, FormHeader } from '../forms/FormControl.styled';
import { ColorPicker } from '../forms/ColorPicker';
import { FormContainerDiv } from '../forms/FormContainerDiv';
import { useWebBuilderProperties } from '../PropertiesProvider';
import { FormProperty } from '../FormProperty';
import { SidebarView } from '../SidebarProvider';
import { PageSettingsCustomColors } from '../forms/ColorPicker/CustomColors/PageSettingsCustomColors';

const componentName = 'PageSettings';

export function PageSettings() {
  const { t } = useTranslation();
  const { fonts, pageSettingsExtra } = useWebBuilderProperties();
  const pageSettings = usePageSettings();
  const setSidebarView = useSetSidebarView();
  const dispatch = useAppDispatch();
  const undoKey = useAppSelector((state) => state.changes.undoKey);

  const getFormValues = () => pageSettings;

  const setForm = (nextPageSettings: IPageSettings) => {
    dispatch(updatePageSettings({
      pageSettings: nextPageSettings,
    }));
  };

  const onBack = () => {
    setSidebarView(SidebarView.AddElement);
  };

  return (
    <>
      <SidebarHeader {...assignTestProp(componentName, 'header')} onBack={onBack}>
        {t('page.settings.title')}
      </SidebarHeader>
      <SidebarScrollbar>
        <FormContainerDiv>
          <FormProvider
            key={undoKey}
            getFormValues={getFormValues}
            setForm={setForm}
          >
            { fonts && (
              <FormGroup>
                <FormHeader>
                  {t('page.fontFamily')}
                </FormHeader>
                <Select
                  name="fontFamily"
                  size="lg"
                  options={fonts}
                />
              </FormGroup>
            ) }
            <FormGroup>
              <FormHeader>
                {t('page.background')}
              </FormHeader>
              <ColorPicker
                name="backgroundColor"
                errors={undefined}
                sketchLabel={t('page.background')}
                customColors={<PageSettingsCustomColors />}
              />
            </FormGroup>
            {
              pageSettingsExtra && pageSettingsExtra.map((prop) => (
                <FormProperty
                  key={prop.id}
                  formCreatorId="pageSettings"
                  name={prop.id}
                  prop={prop}
                />
              ))
            }
          </FormProvider>
        </FormContainerDiv>
      </SidebarScrollbar>
    </>
  );
}
