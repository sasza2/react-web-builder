import { CSSProperties } from 'react';

import { useContainerStyle, ContainerStyleProps } from '@/components/ElementContainer/useContainerStyle';
import { useContainerElementProperties } from './useContainerElementProperties';

export const useContainerGridStyle = (): CSSProperties => {
  const properties = useContainerElementProperties();
  const style = useContainerStyle(properties as ContainerStyleProps);

  return style;
};
