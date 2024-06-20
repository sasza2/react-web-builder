import { useBoxStyle } from '@/components/View/Box/useBoxStyle';
import { CSSProperties } from 'react';
import { Border, BreakpointHeight } from 'types';

type ContainerStyleProps = {
  border?: Border,
  breakpointHeight: BreakpointHeight,
  boxShadow?: string,
};

export const useContainerStyle = ({
  border,
  breakpointHeight,
  boxShadow,
}: ContainerStyleProps): CSSProperties => {
  const style = useBoxStyle({
    border,
    boxShadow,
  });

  if (breakpointHeight?.enabled) {
    const height = parseInt(breakpointHeight?.height as unknown as string) || undefined;
    if (height) {
      style.height = `${height}px`;
      style.maxHeight = style.height;
    }

    if (breakpointHeight?.overflow) {
      style.overflowY = breakpointHeight.overflow;
    }
  }

  return style;
};
