import React from 'react';
import type { Breakpoint } from 'types';

import { StyleProvider } from '../StyleProvider';
import { Wrapper } from './Separator.styled';

type SeparatorProps = {
  breakpoint?: Breakpoint,
};

export function Separator({ breakpoint }: SeparatorProps) {
  return (
    <StyleProvider>
      <Wrapper $height={breakpoint?.rowHeight} />
    </StyleProvider>
  );
}
