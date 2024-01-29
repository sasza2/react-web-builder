import React from 'react';

import { Resizable } from '@/components/Resizable';

export default { title: 'Resizable' };

export function ResizableStory() {
  return (
    <Resizable defaultHeight={30} minHeight={20}>
      <div style={{ backgroundColor: 'violet', height: '100%' }}>resize</div>
    </Resizable>
  );
}
