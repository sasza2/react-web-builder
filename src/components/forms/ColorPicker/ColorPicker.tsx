import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldProvider, useField } from '@/components/FormProvider';
import {
  getColorForSketch, getColorForInput,
} from '@/utils/colors';
import { usePresetColors } from '@/hooks/usePresetColors';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
import { Label } from '../FormControl.styled';
import { ColorPickerSketch } from '../ColorPickerSketch';
import {
  ColorsContainer, InputContainer,
} from './ColorPicker.styled';
import { Input } from '../Input';
import { Color } from './Color';
import { DefaultCustomColors } from './DefaultCustomColors';

type ColorPickerProps = {
  customColors?: React.ReactNode,
  onBlur?: (value: string) => void,
  defaultValue?: string,
  sketchLabel?: JSX.Element | string,
} & IFormControl;

export function ColorPicker({
  customColors,
  defaultValue,
  errors,
  label,
  sketchLabel,
  onBlur,
  name,
}: ColorPickerProps) {
  const { t } = useTranslation();
  const presetColors = usePresetColors();
  const [isSketchOpen, setSketchIsOpen] = useState(false);
  const { setValue, value } = useField<string>(name);
  const inputContainerRef = useRef<HTMLDivElement>();

  const onSketchSetValue = (nextValue: string) => {
    setValue(nextValue);
    if (onBlur) onBlur(nextValue);
  };

  const onSketchOpen: React.MouseEventHandler = (e) => {
    if (isSketchOpen) return;

    e.preventDefault();
    e.stopPropagation();
    setSketchIsOpen(true);
  };

  const onSketchClose = () => {
    setSketchIsOpen(false);
  };

  const onSelectDefaultValue = () => {
    onSketchSetValue(null);
  };

  const onSelectClick = (nextValue: string) => {
    onSketchClose();

    if (nextValue === 'default') {
      onSelectDefaultValue();
      return;
    }

    if (nextValue === 'transparent') {
      onSketchSetValue('transparent');
      return;
    }

    onSketchSetValue(nextValue);
  };

  return (
    <FormControl
      name={name}
      label={label}
      errors={errors}
      testId="colorPicker"
    >
      <InputContainer onClick={onSketchOpen} ref={inputContainerRef}>
        <Color
          color={getColorForSketch(value, defaultValue)}
          active
          size="lg"
        />
        <FieldProvider
          name="color"
          setValue={onSelectClick}
          value={getColorForInput(value, defaultValue)}
        >
          <Input
            name="color"
            testId="color"
            errors={errors}
            onBlur={onBlur}
            leftNode="#"
          />
        </FieldProvider>
      </InputContainer>
      <Label>
        {t('color.default')}
      </Label>
      <Color
        color={getColorForSketch(defaultValue)}
        active={value === null}
        onClick={() => onSelectClick('default')}
      />
      <Label>
        {t('color.preset')}
      </Label>
      <ColorsContainer>
        <Color
          color="transparent"
          onClick={() => onSelectClick('transparent')}
          active={value === 'transparent'}
        />
        {presetColors.map((color, index) => (
          <Color
            key={`${color}-${index}`} // eslint-disable-line react/no-array-index-key
            color={color}
            onClick={() => onSelectClick(color)}
            active={color === value}
          />
        ))}
      </ColorsContainer>
      <Label>{t('color.custom')}</Label>
      { customColors || (
        <DefaultCustomColors
          setValue={onSketchSetValue}
          value={value}
        />
      ) }
      <FieldProvider
        name="color"
        setValue={onSketchSetValue}
        value={getColorForSketch(value, defaultValue)}
      >
        <ColorPickerSketch
          name="color"
          isOpen={isSketchOpen}
          opener={inputContainerRef}
          onClose={onSketchClose}
          defaultValue={defaultValue}
          label={sketchLabel}
        />
      </FieldProvider>
    </FormControl>
  );
}
