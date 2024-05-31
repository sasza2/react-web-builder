import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useField } from '@/components/FormProvider';
import { RenderInSidebarModal } from '@/components/RenderInSidebarModal';
import { ColorType, getColorForSketch } from '@/utils/colors';
import { ColorBasic } from '@/components/icons/ColorBasic';
import { ColorGradient } from '@/components/icons/ColorGradient';
import { getColorType } from '@/utils/colors/common';
import { FlexHorizontal } from '@/components/styles/common';
import { FormHeader, Label } from '../../FormControl.styled';
import { Container } from './ColorPickerModal.styled';
import { GradientColorPicker } from './GradientColorPicker';
import { ColorContainer } from '../Color';
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
  const [type, setType] = useState<ColorType>(
    () => (getColorType(value) === ColorType.Gradient
      ? ColorType.Gradient
      : ColorType.Hex),
  );

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
                onClick={() => setType(ColorType.Hex)}
              >
                <ColorBasic height={20} width={20} />
              </ColorContainer>
              <ColorContainer
                $active={type === ColorType.Gradient}
                $hasBackground={false}
                $size={24}
                onClick={() => setType(ColorType.Gradient)}
              >
                <ColorGradient height={20} width={20} />
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
