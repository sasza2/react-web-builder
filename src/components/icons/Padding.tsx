import React from 'react';
import styled, { useTheme } from 'styled-components';

import { IconWrapperProps } from './types';

const Icon = styled.svg<{ $rotate?: number }>`
  transform: ${({ $rotate }) => `rotate(${$rotate || 0}deg)`};
`;

type PaddingProps = {
  rotate?: number,
} & IconWrapperProps;

export function Padding({ rotate, ...props }: PaddingProps) {
  const theme = useTheme();
  return (
    <Icon
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      $rotate={rotate}
      {...props}
    >
      <rect x="5" y="4" width="8" height="8" rx="1" stroke={theme.colors.lightGray} strokeWidth="2" />
      <line x1="1" y1="1" x2="1" y2="15" stroke={theme.colors.darkBlue} strokeWidth="2" strokeLinecap="round" />
    </Icon>
  );
}
