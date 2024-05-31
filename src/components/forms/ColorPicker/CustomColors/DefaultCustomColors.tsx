import React, { useMemo } from 'react';

import { usePageSettings } from '@/hooks/usePageSettings';
import { updatePageSettings } from '@/store/pageSettingsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { isValidColor } from '@/utils/colors';
import { CustomColors } from './CustomColors';

type DefaultCustomColorsProps = {
  allowGradient?: boolean,
  setValue: (value: string) => void,
  value: string,
};

export function DefaultCustomColors({
  allowGradient,
  setValue,
  value,
}: DefaultCustomColorsProps) {
  const dispatch = useAppDispatch();
  const pageSettings = usePageSettings();
  const colors: string[] = useMemo(() => {
    if (!pageSettings.colors) return [];
    if (allowGradient) return pageSettings.colors;

    return pageSettings.colors.filter(isValidColor);
  }, [allowGradient, pageSettings.colors]);

  const setColors = (nextColors: string[]) => {
    dispatch(updatePageSettings({
      pageSettings: {
        colors: nextColors,
      },
    }));
  };

  const onChange = ({ color, customColors }: { color?: string, customColors?: string [] }) => {
    if (customColors) setColors(customColors);
    if (color !== undefined) setValue(color);
  };

  return (
    <CustomColors
      allowGradient={allowGradient}
      colors={colors}
      onChange={onChange}
      value={value}
    />
  );
}
