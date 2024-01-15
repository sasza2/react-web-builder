import React, { useRef, useState } from 'react';
import { ColorChangeHandler, SketchPicker } from 'react-color';
import { useTranslation } from 'react-i18next';

import { useField } from '@/components/FormProvider';
import { RenderInSidebarModal } from '@/components/RenderInSidebarModal';
import { getColorForSketch, isColorTransparent, normalizeSketchColor } from '@/utils/colors';
import { FormHeader } from '../FormControl.styled';
import { Container, Label } from './ColorPickerSketch.styled';

const DEBOUNCE_TIMEOUT = 200; // ms

type ColorPickerSketchProps = {
  children?: React.ReactNode,
  defaultValue?: string | null,
  isOpen: boolean,
  label?: string | JSX.Element,
  name: string,
  onClose: () => void,
  opener?: React.MutableRefObject<HTMLElement>,
};

export function ColorPickerSketch({
  children,
  defaultValue,
  isOpen,
  label,
  name,
  onClose,
  opener,
}: ColorPickerSketchProps) {
  const { t } = useTranslation();
  const { setValue, value } = useField<string>(name);
  const [internalColor, setInternalColor] = useState(value);
  const debounceTime = useRef<ReturnType<typeof setTimeout>>();

  const onChange: ColorChangeHandler = (nextColor, e) => {
    e.preventDefault();
    e.stopPropagation();

    const normalizedColor = normalizeSketchColor(nextColor);
    if (normalizedColor === value) return;

    setInternalColor(normalizedColor);

    if (debounceTime.current) {
      clearTimeout(debounceTime.current);
    }

    debounceTime.current = setTimeout(() => {
      setValue(normalizedColor);
      debounceTime.current = null;
    }, DEBOUNCE_TIMEOUT);
  };

  return (
    <RenderInSidebarModal
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
        <SketchPicker
          color={getColorForSketch(internalColor, defaultValue)}
          onChange={onChange}
          presetColors={[]}
          width="263px"
        />
        {children}
        { isColorTransparent(internalColor) && (
          <Label>
            *
            {' '}
            {t('color.transparentInfo')}
          </Label>
        ) }
      </Container>
    </RenderInSidebarModal>
  );
}
