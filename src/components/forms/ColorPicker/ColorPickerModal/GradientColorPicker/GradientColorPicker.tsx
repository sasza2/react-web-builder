import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import { LinkGhostButton, RemoveGhostButton } from '@/components/Button';
import { FieldProvider } from '@/components/FormProvider';
import { FlexVertical } from '@/components/styles/common';
import { gradientToValue, GradientType, splitGradientColor } from '@/utils/colors';

import { Label } from '../../../FormControl.styled';
import { RangeSlider } from '../../../RangeSlider';
import { Select } from '../../../Select';
import { ColorPicker } from '../..';
import { ButtonsActions } from './GradientColorPicker.styled';

type GradientColorPickerProps = {
  setValue: (value: string) => void,
  value: string,
};

export function GradientColorPicker({
  setValue,
  value,
}: GradientColorPickerProps) {
  const { t } = useTranslation();
  const gradient = useMemo(() => splitGradientColor(value), [value]);

  const setType = (type: GradientType) => setValue(gradientToValue({
    ...gradient,
    type,
  }));

  const setAngle = (angle: number) => setValue(gradientToValue({
    ...gradient,
    angle,
  }));

  const setColorPercent = (index: number) => (percent: number) => {
    gradient.colors[index].percent = percent;
    setValue(gradientToValue(gradient));
  };

  const setColor = (index: number) => (color: string) => {
    gradient.colors[index].color = color;
    setValue(gradientToValue(gradient));
  };

  const onAddColor = () => {
    gradient.colors.push({
      color: '#000000',
      percent: 100,
    });
    setValue(gradientToValue(gradient));
  };

  const onRemoveColor = () => {
    gradient.colors.pop();
    setValue(gradientToValue(gradient));
  };

  return (
    <>
      <FieldProvider value={gradient.type} setValue={setType} name="type">
        <Select
          name="type"
          options={[
            {
              label: t('color.gradient.types.linear'),
              value: GradientType.Linear,
            },
            {
              label: t('color.gradient.types.radial'),
              value: GradientType.Radial,
            },
          ]}
          size="lg"
        />
      </FieldProvider>
      {gradient.type === GradientType.Linear && (
        <FieldProvider value={gradient.angle} setValue={setAngle} name="angle">
          <RangeSlider
            min={0}
            max={359}
            name="angle"
            rightNode="°"
            label={t('color.gradient.angle')}
          />
        </FieldProvider>
      )}
      {gradient.colors.map((item, index) => ( // eslint-disable-next-line react/no-array-index-key
        <div key={index}>
          <Label>
            {t('color.gradient.itemNr', { nr: index + 1 })}
          </Label>
          <FlexVertical $gap="8px">
            <FieldProvider value={item.percent} setValue={setColorPercent(index)} name="percent">
              <RangeSlider
                min={0}
                max={100}
                name="percent"
                rightNode="%"
              />
            </FieldProvider>
            <FieldProvider value={item.color} setValue={setColor(index)} name="color">
              <ColorPicker
                closeOnlyOnClickOutsideSidebarModal={false}
                name="color"
                showCustomColors={false}
                showDefaultColor={false}
                showPresetColors={false}
                sketchLabel={t('color.color')}
              />
            </FieldProvider>
          </FlexVertical>
        </div>
      ))}
      <ButtonsActions $gap="16px">
        <LinkGhostButton onClick={onAddColor}>
          {t('color.gradient.add')}
        </LinkGhostButton>
        <RemoveGhostButton disabled={gradient.colors.length <= 2} onClick={onRemoveColor}>
          {t('color.gradient.remove')}
        </RemoveGhostButton>
      </ButtonsActions>
    </>
  );
}
