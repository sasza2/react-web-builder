import type { CSSProperties } from 'react';

import { type ContainerStyleProps, useContainerStyle } from '@/components/ElementContainer/useContainerStyle';

import { useContainerElementProperties } from './useContainerElementProperties';

export const useContainerGridStyle = (): CSSProperties => {
  const properties = useContainerElementProperties();
  const style = useContainerStyle(properties as ContainerStyleProps);

  return style;
};
