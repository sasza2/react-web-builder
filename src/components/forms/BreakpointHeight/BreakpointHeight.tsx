import React from 'react';
import { useTranslation } from 'react-i18next';

import { BreakpointHeight as IBreakpointHeight } from 'types';
import { assignTestProp } from '@/utils/tests';
import { useField } from '@/components/FormProvider';
import { normalizeInt } from '@/utils/field';
import { FormGroup, FormHeader } from '../FormControl.styled';
import { Toggle } from '../Toggle';
import { Input } from '../Input';
import { Select } from '../Select';

type BreakpointHeightProps = {
  name: string,
  testId?: string,
};

export function BreakpointHeight({ name, testId }: BreakpointHeightProps) {
  const { t } = useTranslation();
  const { value } = useField<IBreakpointHeight>(name);
  const enabled = value?.enabled;

  return (
    <FormGroup {...assignTestProp(testId, null, 'padding')}>
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
          <Select
            name={`${name}.overflow`}
            label={t('breakpoint.heightProp.overflow.label')}
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
    </FormGroup>
  );
}
