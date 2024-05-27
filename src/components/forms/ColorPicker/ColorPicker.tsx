import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { FieldProvider, useField } from '@/components/FormProvider';
import {
  getColorForSketch, getColorForInput,
  ColorType,
} from '@/utils/colors';
import { usePresetColors } from '@/hooks/usePresetColors';
import { getColorType } from '@/utils/colors/common';
import { IFormControl } from '../types';
import { FormControl } from '../FormControl';
import { Label } from '../FormControl.styled';
import { ColorPickerModal } from './ColorPickerModal';
import {
  ColorsContainer, InputContainer,
} from './ColorPicker.styled';
import { Input } from '../Input';
import { Color } from './Color';
import { DefaultCustomColors } from './CustomColors/DefaultCustomColors';

type ColorPickerProps = {
  allowGradient?: boolean,
  closeOnlyOnClickOutsideSidebarModal?: boolean,
  customColors?: React.ReactNode,
  onBlur?: (value: string) => void,
  defaultValue?: string,
  showCustomColors?: boolean,
  showDefaultColor?: boolean,
  showPresetColors?: boolean,
  sketchLabel?: JSX.Element | string,
} & IFormControl;

export function ColorPicker({
  allowGradient,
  closeOnlyOnClickOutsideSidebarModal,
  customColors,
  defaultValue,
  errors,
  label,
  showCustomColors = true,
  showDefaultColor = true,
  showPresetColors = true,
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

  const mainColor = () => {
    const colorType = getColorType(value);
    switch (colorType) {
      case ColorType.Gradient:
        return value;
      default:
        return getColorForSketch(value, defaultValue);
    }
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
          color={mainColor()}
          active
          size="lg"
        />
        {getColorType(value) === ColorType.Hex && (
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
        )}
      </InputContainer>
      {showDefaultColor && (
        <>
          <Label>
            {t('color.default')}
          </Label>
          <Color
            color={getColorForSketch(defaultValue)}
            active={value === null}
            onClick={() => onSelectClick('default')}
          />
        </>
      )}
      {showPresetColors && (
        <>
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
        </>
      )}
      { showCustomColors && (
        <>
          <Label>{t('color.custom')}</Label>
          { customColors || (
            <DefaultCustomColors
              allowGradient={allowGradient}
              setValue={onSketchSetValue}
              value={value}
            />
          ) }
        </>
      )}
      {isSketchOpen && (
        <FieldProvider
          name="color"
          setValue={onSketchSetValue}
          value={value}
        >
          <ColorPickerModal
            allowGradient={allowGradient}
            closeOnlyOnClickOutsideSidebarModal={closeOnlyOnClickOutsideSidebarModal}
            name="color"
            isOpen
            opener={inputContainerRef}
            onClose={onSketchClose}
            defaultValue={defaultValue}
            label={sketchLabel}
          />
        </FieldProvider>
      )}
    </FormControl>
  );
}
