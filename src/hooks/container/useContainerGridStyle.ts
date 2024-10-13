import { CSSProperties } from 'react';

import { ContainerStyleProps, useContainerStyle } from '@/components/ElementContainer/useContainerStyle';

import { useContainerElementProperties } from './useContainerElementProperties';

export const useContainerGridStyle = (): CSSProperties => {
  const properties = useContainerElementProperties();
  const style = useContainerStyle(properties as ContainerStyleProps);

  return style;
};
