import React from 'react';
import { FontOptions as IFontOptions } from 'types';

import { FieldProvider, useField } from '@/components/FormProvider';
import { Icon } from '@/components/icons/Icon';
import { DEFAULT_LETTER_SPACING, DEFAULT_LINE_HEIGHT } from '@/consts';

import { ButtonWrapper } from '../RichText/buttons.styled';
import { FONT_SIZES } from '../RichText/FontSizeSelect/FontSizeSelect';
import { LETTER_SPACINGS } from '../RichText/LetterSpacing';
import { Container as LineHeightContainer, LINE_HEIGHTS } from '../RichText/LineHeight';
import { ToolbarWrapper } from '../RichText/Toolbar/Toolbar.styled';
import { Select } from '../Select';
import { IFormControl } from '../types';

type FontOptionsProps = IFormControl;

export function FontOptions({
  name,
}: FontOptionsProps) {
  const { value = {} as IFontOptions, setValue } = useField<IFontOptions>(name);

  const onChangeToggle = (option: keyof IFontOptions) => {
    setValue({
      ...value,
      [option]: !value[option],
    });
  };

  const onChangeTextAlign = (textAlign: IFontOptions['textAlign']) => {
    setValue({
      ...value,
      textAlign,
    });
  };

  const onChangeFontSize = (size: number) => {
    setValue({
      ...value,
      size,
    });
  };

  const onChangeLineHeight = (lineHeight: string) => {
    setValue({
      ...value,
      lineHeight,
    });
  };

  const onChangeLetterSpacing = (letterSpacing: string) => {
    setValue({
      ...value,
      letterSpacing,
    });
  };

  return (
    <ToolbarWrapper>
      <FieldProvider
        name="fontSize"
        setValue={onChangeFontSize}
        value={Math.floor(value.size || 0) || 12}
      >
        <Select
          name="fontSize"
          options={FONT_SIZES}
          size="xs"
        />
      </FieldProvider>
      <ButtonWrapper
        $active={!!value.bold}
        onClick={() => onChangeToggle('bold')}
      >
        <Icon icon={Icon.TextBold} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={!!value.italic}
        onClick={() => onChangeToggle('italic')}
      >
        <Icon icon={Icon.TextItalic} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={!!value.underline}
        onClick={() => onChangeToggle('underline')}
      >
        <Icon icon={Icon.TextUnderline} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={!value.textAlign || value.textAlign === 'left'}
        onClick={() => onChangeTextAlign('left')}
      >
        <Icon icon={Icon.TextLeft} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={value.textAlign === 'center'}
        onClick={() => onChangeTextAlign('center')}
      >
        <Icon icon={Icon.TextCenter} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={value.textAlign === 'right'}
        onClick={() => onChangeTextAlign('right')}
      >
        <Icon icon={Icon.TextRight} />
      </ButtonWrapper>
      <ButtonWrapper
        $active={value.textAlign === 'justify'}
        onClick={() => onChangeTextAlign('justify')}
      >
        <Icon icon={Icon.TextJustify} />
      </ButtonWrapper>
      <FieldProvider
        name="lineHeight"
        setValue={onChangeLineHeight}
        value={value.lineHeight || DEFAULT_LINE_HEIGHT}
      >
        <LineHeightContainer>
          <Icon icon={Icon.LineHeight} />
          <Select
            name="lineHeight"
            options={LINE_HEIGHTS}
            size="xs"
          />
        </LineHeightContainer>
      </FieldProvider>
      <FieldProvider
        name="letterSpacing"
        setValue={onChangeLetterSpacing}
        value={value.letterSpacing || DEFAULT_LETTER_SPACING}
      >
        <LineHeightContainer>
          <Icon icon={Icon.LetterSpacing} />
          <Select
            name="letterSpacing"
            options={LETTER_SPACINGS}
            size="xs"
          />
        </LineHeightContainer>
      </FieldProvider>
    </ToolbarWrapper>
  );
}
