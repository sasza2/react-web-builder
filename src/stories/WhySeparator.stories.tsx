import React from 'react';

import { StyleProvider } from '@/components/StyleProvider';

import { WhySeparator } from '../components/WhySeparator';

export default { title: 'WhySeparator' };

export function WhySeparatorStory() {
  return (
    <StyleProvider>
      <WhySeparator />
    </StyleProvider>
  );
}
