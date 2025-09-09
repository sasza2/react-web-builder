import React from 'react';
import type { PageSettings } from 'types';

import { usePageSettings } from '@/hooks/usePageSettings';
import { updatePageSettings } from '@/store/pageSettingsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';

import { CustomColors } from './CustomColors';

type PageSettingsCustomColorsProps = {
  allowGradient?: boolean,
};

export function PageSettingsCustomColors({
  allowGradient,
}: PageSettingsCustomColorsProps) {
  const dispatch = useAppDispatch();
  const pageSettings = usePageSettings();
  const colors: string[] = pageSettings.colors || [];

  const onChange = ({ color, customColors }: { color?: string, customColors?: string [] }) => {
    const nextPageSettings: Partial<PageSettings> = {};
    if (color !== undefined) nextPageSettings.backgroundColor = color;
    if (customColors) nextPageSettings.colors = customColors;

    dispatch(updatePageSettings({
      pageSettings: nextPageSettings,
    }));
  };

  return (
    <CustomColors
      allowGradient={allowGradient}
      colors={colors}
      onChange={onChange}
      value={pageSettings.backgroundColor}
    />
  );
}
