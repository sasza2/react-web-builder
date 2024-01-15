import React, { useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { Icon } from '@/components/icons/Icon';
import { FieldProvider } from '@/components/FormProvider';
import { ColorPickerSketch } from '../ColorPickerSketch';
import { Button } from '../RichText/buttons';
import { Label } from '../ColorPickerSketch/ColorPickerSketch.styled';
import { AddIcon, ColorsContainer } from './ColorPicker.styled';
import { Color } from './Color';

type CustomColorsProps = {
  colors: string[],
  onChange: (payload: { color?: string, customColors?: string[] }) => void,
  value: string,
};

export function CustomColors({
  colors,
  onChange,
  value,
}: CustomColorsProps) {
  const { t } = useTranslation();
  const [editIndex, setEditIndex] = useState(-1);
  const colorContainerRef = useRef<HTMLDivElement>();

  const onSketchClose = () => {
    setEditIndex(-1);
  };

  const onSketchSetValue = (nextValue: string) => {
    if (colors[editIndex] === nextValue) return;

    const nextColors = [...colors];
    nextColors[editIndex] = nextValue;
    onChange({
      color: nextValue,
      customColors: nextColors,
    });
  };

  const addColor = () => {
    setEditIndex(colors.length);
    onChange({
      color: '#ffffff',
      customColors: [...colors, '#ffffff'],
    });
  };

  const onColorClick = (e: React.MouseEvent, color: string, index: number) => {
    colorContainerRef.current = e.target as HTMLDivElement;
    setEditIndex(index);
    onChange({
      color,
    });
  };

  const onRemoveColor = () => {
    const nextColors = [...colors];
    nextColors.splice(editIndex, 1);
    onChange({ customColors: nextColors });
    setEditIndex(-1);
  };

  return (
    <ColorsContainer>
      {colors.map((color, index) => (
        <Color
          key={`${color}-${index}`} // eslint-disable-line react/no-array-index-key
          color={color}
          onClick={(e) => onColorClick(e, color, index)}
          active={color === value}
        />
      ))}
      <AddIcon onClick={addColor}>
        <Icon icon={Icon.Cross} />
      </AddIcon>
      { editIndex >= 0 && (
        <FieldProvider
          name="color"
          setValue={onSketchSetValue}
          value={colors[editIndex]}
        >
          <ColorPickerSketch
            name="color"
            isOpen
            opener={colorContainerRef}
            onClose={onSketchClose}
            defaultValue={colors[editIndex]}
            label={t('color.custom')}
          >
            <Label>
              *
              {' '}
              <Trans
                i18nKey="color.remove"
                components={{
                  icon: (
                    <Button
                      icon={<Icon icon={Icon.Trash} />}
                      inline
                      onClick={onRemoveColor}
                    />
                  ),
                }}
              />
            </Label>
          </ColorPickerSketch>
        </FieldProvider>
      ) }
    </ColorsContainer>
  );
}
