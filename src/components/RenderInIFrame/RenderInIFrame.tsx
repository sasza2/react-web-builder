import React, { useCallback, useState } from 'react';
import { StyleSheetManager } from 'styled-components';
import Frame, { useFrame } from 'react-frame-component';

import { LoadFont } from '@/LoadFont';
import { assignTestProp } from '@/utils/tests';
import { IFrameGlobalStyles } from './RenderInIFrame.styled';

function RenderInIFrameBody({ children }: React.PropsWithChildren) {
  const { document } = useFrame();
  return (
    <StyleSheetManager target={document.head} disableCSSOMInjection>
      {children}
      <LoadFont />
      <IFrameGlobalStyles />
    </StyleSheetManager>
  );
}

export function RenderInIFrame({ children }: React.PropsWithChildren) {
  const [ready, setReady] = useState(false);

  const onLoad = useCallback(() => {
    setReady(true);
  }, []);

  return (
    <Frame
      style={{ opacity: ready ? 1 : 0 }}
      {...assignTestProp('richTextFrame')}
      ref={onLoad}
      title="richtext-frame"
    >
      <RenderInIFrameBody>
        {children}
      </RenderInIFrameBody>
    </Frame>
  );
}
