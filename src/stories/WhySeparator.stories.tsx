import React from 'react';

import { StyleProvider } from '@/components/StyleProvider';
import { GlobalStyles } from '@/WebBuilder.styled';

import { WhySeparator as WhySeparatorComponent } from '../components/WhySeparator';

export function WhySeparator() {
  return (
    <StyleProvider>
      <WhySeparatorComponent />
      <GlobalStyles />
    </StyleProvider>
  );
}

const meta = {
  component: WhySeparator,
  title: 'WebBuilder/WhySeparator',
};

export default meta;
