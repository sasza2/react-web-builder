import React from 'react';
import { useTranslation } from 'react-i18next';

import { normalizeInt } from '@/utils/field';
import { assignTestProp } from '@/utils/tests';
import { Padding as PaddingIcon } from '@/components/icons/Padding';
import { FormGroup, FormHeader } from '../FormControl.styled';
import { Input } from '../Input';
import { PaddingContainer } from '../Padding/Padding.styled';
import { RangeSlider } from '../RangeSlider';
import { ColorPicker } from '../ColorPicker';
import { IFormControl } from '../types';

type BorderProps = {
  name: string,
} & IFormControl;

export function Border({
  name,
  testId,
}: BorderProps) {
  const { t } = useTranslation();
  return (
    <FormGroup {...assignTestProp(testId, null, 'border')}>
      <FormHeader>
        {t('element.border.name')}
      </FormHeader>
      <PaddingContainer>
        <Input
          name={`${name}.left`}
          testId={`${name}.left`}
          leftNode={<PaddingIcon />}
          rightNode={t('common.pixels')}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.top`}
          testId={`${name}.top`}
          leftNode={<PaddingIcon rotate={90} />}
          rightNode={t('common.pixels')}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.right`}
          testId={`${name}.right`}
          leftNode={<PaddingIcon rotate={180} />}
          rightNode={t('common.pixels')}
          normalize={normalizeInt}
        />
        <Input
          name={`${name}.bottom`}
          testId={`${name}.bottom`}
          leftNode={<PaddingIcon rotate={270} />}
          rightNode={t('common.pixels')}
          normalize={normalizeInt}
        />
      </PaddingContainer>
      <RangeSlider
        name={`${name}.radius`}
        label={t('element.border.radius')}
        max={20}
        rightNode="px"
        testId={`${name}.radius`}
      />
      <ColorPicker
        name={`${name}.color`}
        label={t('element.border.color')}
        sketchLabel={t('element.border.color')}
        testId={`${name}.color`}
      />
    </FormGroup>
  );
}
