import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { usePageSettings } from '@/hooks/usePageSettings';
import { useSetSidebarView } from '@/hooks/useSetSidebarView';

import { RemoveGhostButton } from '../Button';
import { ColorPicker } from '../forms/ColorPicker';
import { FormGroup, FormHeader } from '../forms/FormControl.styled';
import { Input } from '../forms/Input';
import { Padding } from '../forms/Padding';
import { Toggle } from '../forms/Toggle';
import { SidebarView } from '../SidebarProvider';
import { Clickable } from './Form.styled';
import { Errors } from './types';

type FormProps = {
  errors: Errors,
  onClearBreakpoint?: React.MouseEventHandler,
  onSave?: () => void,
};

export function Form({
  errors,
  onClearBreakpoint,
  onSave,
}: FormProps) {
  const { t } = useTranslation();
  const pageSettings = usePageSettings();
  const setSidebarView = useSetSidebarView();

  const goToPageSettings = () => {
    setSidebarView(SidebarView.PageSettings);
  };

  const renderPageSettingsLink = ({ children }: { children: JSX.Element | string }) => (
    <Clickable onClick={goToPageSettings}>
      {children}
    </Clickable>
  );

  return (
    <>
      <FormGroup>
        <FormHeader>
          {t('breakpoint.layout')}
        </FormHeader>
        <Input
          label={t('breakpoint.minWidth')}
          name="from"
          testId="from"
          errors={errors}
          onBlur={onSave}
          rightNode={t('common.pixels')}
        />
        <Toggle
          label={t('breakpoint.stretchToAvailableWidth')}
          name="stretchToAvailableWidth"
          testId="stretchToAvailableWidth"
          errors={errors}
          onBlur={onSave}
        />
        <Input
          label={t('breakpoint.rowHeight')}
          name="rowHeight"
          testId="rowHeight"
          errors={errors}
          onBlur={onSave}
          rightNode={t('common.pixels')}
        />
        <Input
          label={t('breakpoint.numberOfColumns')}
          name="cols"
          testId="cols"
          errors={errors}
          onBlur={onSave}
        />
        { onClearBreakpoint && (
          <RemoveGhostButton onClick={onClearBreakpoint}>
            {t('breakpoint.clear')}
          </RemoveGhostButton>
        ) }
      </FormGroup>
      <Padding
        name="padding"
        testId="padding"
        errors={errors}
        onBlur={onSave}
      />
      <FormGroup>
        <FormHeader>
          {t('breakpoint.background')}
        </FormHeader>
        <ColorPicker
          allowGradient
          name="backgroundColor"
          label={(
            <Trans
              i18nKey="breakpoint.backgroundDefaultInfo"
              components={{
                a: React.createElement(renderPageSettingsLink),
              }}
            />
          )}
          errors={errors}
          onBlur={onSave}
          defaultValue={pageSettings.backgroundColor}
          sketchLabel={t('breakpoint.background')}
        />
      </FormGroup>
    </>
  );
}
