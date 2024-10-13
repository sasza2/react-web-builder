import React from 'react';
import { useTranslation } from 'react-i18next';

import { Padding as PaddingIcon } from '@/components/icons/Padding';
import { normalizeInt } from '@/utils/field';
import { assignTestProp } from '@/utils/tests';

import { FormGroup, FormHeader } from '../FormControl.styled';
import { Input } from '../Input';
import { IFormControl } from '../types';
import { PaddingContainer } from './Padding.styled';

type PaddingProps = {
  onBlur?: (value: string) => void,
} & IFormControl;

export function Padding({
  name,
  onBlur,
  testId,
}: PaddingProps) {
  const { t } = useTranslation();
  return (
    <FormGroup {...assignTestProp(testId, null, 'padding')}>
      <FormHeader>
        {t('element.padding')}
      </FormHeader>
      <PaddingContainer>
        <Input
          name={`${name}.left`}
          testId={`${name}.left`}
          leftNode={<PaddingIcon />}
          rightNode="px"
          onBlur={onBlur}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.top`}
          testId={`${name}.top`}
          leftNode={<PaddingIcon rotate={90} />}
          rightNode="px"
          onBlur={onBlur}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.right`}
          testId={`${name}.right`}
          leftNode={<PaddingIcon rotate={180} />}
          rightNode="px"
          onBlur={onBlur}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.bottom`}
          testId={`${name}.bottom`}
          leftNode={<PaddingIcon rotate={270} />}
          rightNode="px"
          onBlur={onBlur}
          normalize={normalizeInt}
        />
      </PaddingContainer>
    </FormGroup>
  );
}
