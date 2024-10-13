import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldProvider, useField } from '@/components/FormProvider';
import { BoxShadow as IBoxShadow, boxShadowToValue, splitBoxShadow } from '@/utils/boxShadow';
import { assignTestProp } from '@/utils/tests';

import { ColorPicker } from '../ColorPicker';
import { FormGroup, FormHeader } from '../FormControl.styled';
import { RangeSlider } from '../RangeSlider';
import { Toggle } from '../Toggle';
import { IFormControl } from '../types';

type BoxShadowProps = {
  name: string,
} & IFormControl;

export function BoxShadow({
  name,
  testId,
}: BoxShadowProps) {
  const { t } = useTranslation();
  const { setValue, value } = useField<string>(name);
  const [enabled, setEnabled] = useState(!!value);
  const boxShadow = useMemo(() => splitBoxShadow(value), [value]);

  const toggleEnabled = (nextEnabled: boolean) => {
    setEnabled(nextEnabled);

    if (nextEnabled) {
      setValue(boxShadowToValue(boxShadow));
    } else {
      setValue(null);
    }
  };

  const setBoxShadowValue = <T extends keyof IBoxShadow>(field: T) => (nextValue: IBoxShadow[T]) => {
    boxShadow[field] = nextValue;
    setValue(boxShadowToValue(boxShadow));
  };

  return (
    <FormGroup {...assignTestProp(testId, null, 'boxShadow')}>
      <FormHeader>
        {t('element.boxShadow.name')}
      </FormHeader>
      <FieldProvider
        name="enabled"
        setValue={toggleEnabled}
        value={enabled}
      >
        <Toggle
          name="enabled"
        />
      </FieldProvider>
      {enabled && (
        <>
          <FieldProvider
            name="inset"
            setValue={setBoxShadowValue('inset')}
            value={boxShadow.inset}
          >
            <Toggle
              name="inset"
              label={t('element.boxShadow.inset')}
            />
          </FieldProvider>
          <FieldProvider
            name="horizontalLength"
            setValue={setBoxShadowValue('horizontalLength')}
            value={boxShadow.horizontalLength}
          >
            <RangeSlider
              min={-50}
              max={50}
              name="horizontalLength"
              label={t('element.boxShadow.horizontalLength')}
              rightNode="px"
            />
          </FieldProvider>
          <FieldProvider
            name="verticalLength"
            setValue={setBoxShadowValue('verticalLength')}
            value={boxShadow.verticalLength}
          >
            <RangeSlider
              min={-50}
              max={50}
              name="verticalLength"
              label={t('element.boxShadow.verticalLength')}
              rightNode="px"
            />
          </FieldProvider>
          <FieldProvider
            name="blurRadius"
            setValue={setBoxShadowValue('blurRadius')}
            value={boxShadow.blurRadius}
          >
            <RangeSlider
              min={-50}
              max={50}
              name="blurRadius"
              label={t('element.boxShadow.blurRadius')}
              rightNode="px"
            />
          </FieldProvider>
          <FieldProvider
            name="spreadRadius"
            setValue={setBoxShadowValue('spreadRadius')}
            value={boxShadow.spreadRadius}
          >
            <RangeSlider
              min={-50}
              max={50}
              name="spreadRadius"
              label={t('element.boxShadow.spreadRadius')}
              rightNode="px"
            />
          </FieldProvider>
          <FieldProvider
            name="color"
            setValue={setBoxShadowValue('color')}
            value={boxShadow.color}
          >
            <ColorPicker
              name="color"
              label={t('color.color')}
              sketchLabel={t('color.color')}
              testId="color"
            />
          </FieldProvider>
        </>
      )}
    </FormGroup>
  );
}
