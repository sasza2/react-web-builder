import React from 'react';

import { usePageSettings } from '@/hooks/usePageSettings';
import { updatePageSettings } from '@/store/pageSettingsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { CustomColors } from './CustomColors';

type DefaultCustomColorsProps = {
  setValue: (value: string) => void,
  value: string,
};

export function DefaultCustomColors({
  setValue,
  value,
}: DefaultCustomColorsProps) {
  const dispatch = useAppDispatch();
  const pageSettings = usePageSettings();
  const colors: string[] = pageSettings.colors || [];

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
      colors={colors}
      onChange={onChange}
      value={value}
    />
  );
}
