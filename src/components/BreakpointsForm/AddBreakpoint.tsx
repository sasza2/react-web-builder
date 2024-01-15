import React from 'react';
import { useTranslation } from 'react-i18next';

import { useTheme } from 'styled-components';
import { ConfirmButton } from '@/components/Button';
import { useAddBreakpoint } from '@/hooks/useAddBreakpoint';
import { usePageSettings } from '@/hooks/usePageSettings';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { FormContainerDiv } from '../forms/FormContainerDiv';
import { FormProvider, useFormCreator } from '../FormProvider/FormProvider';
import { formToBreakpoint } from './utils';
import { Buttons } from './Breakpoint.styled';
import { Form } from './Form';
import { useValidateForm } from './useValidateForm';
import { IForm } from './types';

export function AddBreakpoint() {
  const theme = useTheme();
  const { t } = useTranslation();
  const add = useAddBreakpoint();
  const pageSettings = usePageSettings();
  const [errors, validateForm] = useValidateForm();
  const formCreator = useFormCreator<IForm>(() => ({
    backgroundColor: pageSettings.backgroundColor || theme.colors.white,
    stretchToAvailableWidth: true,
    from: '',
    rowHeight: '15',
    cols: '10',
    padding: {
      top: 15,
      right: 15,
      bottom: 0,
      left: 15,
    },
  }));

  const onSaveForm = () => {
    const form = formCreator.getFormValues();
    validateForm(form);
  };

  const onButtonSaveClick: React.MouseEventHandler = (e) => {
    e.preventDefault();

    const form = formCreator.getFormValues();
    const nextErrors = validateForm(form);
    if (nextErrors.length) return;

    add(formToBreakpoint(form));
  };

  const buttons = (
    <Buttons>
      <ConfirmButton onClick={onButtonSaveClick} testId="breakpointAddButton">
        {t('breakpoint.add')}
      </ConfirmButton>
    </Buttons>
  );

  return (
    <>
      <SidebarHeader>
        {t('breakpoint.add')}
      </SidebarHeader>
      <SidebarScrollbar>
        <FormContainerDiv>
          <FormProvider {...formCreator}>
            <Form
              errors={errors}
              onSave={onSaveForm}
            />
          </FormProvider>
          {buttons}
        </FormContainerDiv>
      </SidebarScrollbar>
    </>
  );
}
