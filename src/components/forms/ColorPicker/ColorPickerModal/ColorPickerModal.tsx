import React, { useId, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Tooltip } from 'react-tooltip';

import { useField } from '@/components/FormProvider';
import { ColorBasic } from '@/components/icons/ColorBasic';
import { ColorGradient } from '@/components/icons/ColorGradient';
import { RenderInSidebarModal } from '@/components/RenderInSidebarModal';
import { FlexHorizontal } from '@/components/styles/common';
import {
  ColorType, getColorForSketch, gradientToValue, splitGradientColor,
} from '@/utils/colors';
import { getColorType } from '@/utils/colors/common';

import { FormHeader, Label } from '../../FormControl.styled';
import { ColorContainer } from '../Color';
import { Container } from './ColorPickerModal.styled';
import { GradientColorPicker } from './GradientColorPicker';
import { HexColorPicker } from './HexColorPicker';

type ColorPickerModalProps = {
  allowGradient?: boolean,
  children?: React.ReactNode,
  closeOnlyOnClickOutsideSidebarModal?: boolean,
  defaultValue?: string | null,
  isOpen: boolean,
  label?: string | JSX.Element,
  name: string,
  onClose?: () => void,
  opener?: React.MutableRefObject<HTMLElement>,
};

export function ColorPickerModal({
  allowGradient,
  children,
  closeOnlyOnClickOutsideSidebarModal,
  defaultValue,
  isOpen,
  label,
  name,
  onClose,
  opener,
}: ColorPickerModalProps) {
  const { t } = useTranslation();
  const { setValue, value } = useField<string>(name);
  const gradientTooltipId = useId();
  const hexTooltipId = useId();

  const [type, setType] = useState<ColorType>(
    () => (getColorType(value) === ColorType.Gradient
      ? ColorType.Gradient
      : ColorType.Hex),
  );

  const setTypeAndInitColor = (colorType: ColorType) => {
    if (type === colorType) return;

    const gradient = splitGradientColor(value);

    if (colorType === ColorType.Gradient) setValue(gradientToValue(gradient));
    else setValue(gradient.colors[0].color);

    setType(colorType);
  };

  return (
    <RenderInSidebarModal
      closeOnlyOnClickOutsideSidebarModal={closeOnlyOnClickOutsideSidebarModal}
      onClose={onClose}
      open={isOpen}
      opener={opener}
    >
      <Container>
        { label && (
          <FormHeader>
            {label}
          </FormHeader>
        )}
        {allowGradient && (
          <>
            <Label>{t('color.type')}</Label>
            <FlexHorizontal $gap="8px">
              <ColorContainer
                $active={type === ColorType.Hex}
                $hasBackground={false}
                $size={24}
                onClick={() => setTypeAndInitColor(ColorType.Hex)}
                data-tooltip-id={hexTooltipId}
              >
                <ColorBasic height={20} width={20} />
                <Tooltip id={hexTooltipId} place="bottom">{t('color.types.hex')}</Tooltip>
              </ColorContainer>
              <ColorContainer
                $active={type === ColorType.Gradient}
                $hasBackground={false}
                $size={24}
                onClick={() => setTypeAndInitColor(ColorType.Gradient)}
                data-tooltip-id={gradientTooltipId}
              >
                <ColorGradient height={20} width={20} />
                <Tooltip id={gradientTooltipId} place="bottom">{t('color.types.gradient')}</Tooltip>
              </ColorContainer>
            </FlexHorizontal>
          </>
        )}
        { allowGradient && type === ColorType.Gradient && <GradientColorPicker setValue={setValue} value={value} /> }
        {type === ColorType.Hex && (
          <HexColorPicker defaultValue={defaultValue} setValue={setValue} value={getColorForSketch(value, defaultValue)}>
            {children}
          </HexColorPicker>
        )}
      </Container>
    </RenderInSidebarModal>
  );
}
