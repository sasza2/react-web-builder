import React from 'react';
import { useTranslation } from 'react-i18next';

import { RemoveButton } from '@/components/Button';
import { useAppSelector } from '@/store/useAppSelector';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';
import { getBreakpointBackgroundColor, getBreakpointPadding } from '@/utils/breakpoint';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useClearBreakpoint } from '@/hooks/useClearBreakpoint';
import { usePageSettings } from '@/hooks/usePageSettings';
import { useRemoveBreakpoint } from '@/hooks/useRemoveBreakpoint';
import { useUpdateBreakpoint } from '@/hooks/useUpdateBreakpoint';
import { useElements } from '@/hooks/useElements';
import { FormProvider, useFormCreator } from '../FormProvider';
import { useConfiguration } from '../ConfigurationProvider';
import { SidebarHeader } from '../SidebarHeader';
import { SidebarView } from '../SidebarProvider';
import { SidebarScrollbar } from '../SidebarScrollbar';
import { FormContainerDiv } from '../forms/FormContainerDiv';
import { Form } from './Form';
import { IForm } from './types';
import { useValidateForm } from './useValidateForm';
import { formToBreakpoint } from './utils';
import { Buttons } from './Breakpoint.styled';

function EditBreakpointIn() {
  const { t } = useTranslation();
  const setSidebarView = useSetSidebarView();
  const breakpoint = useBreakpoint();
  const configuration = useConfiguration();
  const clearBreakpoint = useClearBreakpoint();
  const updateBreakpoint = useUpdateBreakpoint();
  const removeBreakpoint = useRemoveBreakpoint();
  const pageSettings = usePageSettings();
  const [errors, validateForm] = useValidateForm();
  const undoKey = useAppSelector((state) => state.changes.undoKey);
  const { elements } = useElements();

  const getFormBackgroundColor = () => {
    if (!breakpoint.backgroundColor) return null;
    return getBreakpointBackgroundColor(breakpoint, pageSettings) || null;
  };

  const formCreator = useFormCreator<IForm>(() => ({
    ...breakpoint,
    backgroundColor: getFormBackgroundColor(),
    stretchToAvailableWidth: breakpoint.to === null,
    from: `${breakpoint.from}`,
    rowHeight: `${breakpoint.rowHeight}`,
    cols: `${breakpoint.cols}`,
    padding: getBreakpointPadding(breakpoint),
  }) as IForm, [undoKey]);

  const onSave = () => {
    const form = formCreator.getFormValues();
    const nextErrors = validateForm(form);
    if (!nextErrors.length) {
      updateBreakpoint(breakpoint.id, formToBreakpoint(form));
    }
  };

  const onClearBreakpoint: React.MouseEventHandler = (e) => {
    e.preventDefault();

    if (configuration.autoSave) {
      const confirmed = window.confirm(t('breakpoint.clearConfirm')); // eslint-disable-line no-alert
      if (!confirmed) return;
    }

    clearBreakpoint();
  };

  const onRemove = () => {
    if (configuration.autoSave) {
      const confirmed = window.confirm(t('breakpoint.deleteConfirm')); // eslint-disable-line no-alert
      if (!confirmed) return;
    }

    removeBreakpoint(breakpoint);
  };

  const onBack = () => {
    setSidebarView(SidebarView.AddElement);
  };

  const buttons = (
    <Buttons>
      <RemoveButton onClick={onRemove}>
        {t('breakpoint.delete')}
      </RemoveButton>
    </Buttons>
  );

  return (
    <>
      <SidebarHeader onBack={onBack}>
        {t('breakpoint.edit')}
      </SidebarHeader>
      <SidebarScrollbar>
        <FormContainerDiv>
          <FormProvider {...formCreator}>
            <Form
              errors={errors}
              onClearBreakpoint={elements.length ? onClearBreakpoint : undefined}
              onSave={onSave}
            />
          </FormProvider>
          {buttons}
        </FormContainerDiv>
      </SidebarScrollbar>
    </>
  );
}

export function EditBreakpoint() {
  const breakpoint = useBreakpoint();
  if (!breakpoint) return null;
  return <EditBreakpointIn key={breakpoint.id} />;
}
