import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { BreakpointHeight as IBreakpointHeight } from 'types';

import { useField } from '@/components/FormProvider';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { normalizeInt } from '@/utils/field';
import { assignTestProp } from '@/utils/tests';

import { FormGroup, FormHeader } from '../FormControl.styled';
import { Input } from '../Input';
import { Select } from '../Select';
import { Toggle } from '../Toggle';

function ReadMore() {
  const { t } = useTranslation();
  return (
    <a href="https://www.w3schools.com/css/css_overflow.asp" target="_blank" rel="noreferrer">
      {t('breakpoint.heightProp.overflow.readMore')}
    </a>
  );
}

type BreakpointHeightProps = {
  name: string,
  testId?: string,
};

export function BreakpointHeight({ name, testId }: BreakpointHeightProps) {
  const breakpoint = useBreakpoint();
  const { t } = useTranslation();
  const { value } = useField<IBreakpointHeight>(name);
  const enabled = value?.enabled;

  return (
    <FormGroup data-id="breakpointHeight" {...assignTestProp(testId, null, 'breakpointHeight')}>
      <FormHeader>
        {t('breakpoint.heightProp.height')}
      </FormHeader>
      <Toggle
        name={`${name}.enabled`}
        label={t('breakpoint.heightProp.enabled')}
      />
      {enabled && (
        <>
          <Input
            label={t('breakpoint.heightProp.height')}
            name={`${name}.height`}
            rightNode={t('common.pixels')}
            normalize={normalizeInt}
          />
          <Toggle
            label={t('breakpoint.heightProp.responsive.label')}
            name={`${name}.responsive`}
            description={t('breakpoint.heightProp.responsive.description', { value: breakpoint.from })}
          />
          <Select
            name={`${name}.overflow`}
            label={t('breakpoint.heightProp.overflow.label')}
            description={(
              <Trans
                i18nKey="breakpoint.heightProp.overflow.description"
                components={{
                  readMore: <ReadMore />,
                }}
              />
            )}
            options={[
              {
                label: t('breakpoint.heightProp.overflow.visible'),
                value: 'visible',
              },
              {
                label: t('breakpoint.heightProp.overflow.scroll'),
                value: 'scroll',
              },
              {
                label: t('breakpoint.heightProp.overflow.hidden'),
                value: 'hidden',
              },
            ]}
            size="lg"
          />
        </>
      )}
      {value?.overflow === 'scroll' && (
        <Toggle
          name={`${name}.isScrollbarHidden`}
          label={t('breakpoint.heightProp.scrollbarVisibility.label')}
          description={t('breakpoint.heightProp.scrollbarVisibility.description')}
        />
      )}
    </FormGroup>
  );
}
