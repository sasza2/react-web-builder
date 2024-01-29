import React, {
  forwardRef, useCallback, useImperativeHandle, useRef, useState,
} from 'react';
import { StyleSheetManager } from 'styled-components';
import Frame, { useFrame } from 'react-frame-component';

import { LoadFont } from '@/LoadFont';
import { assignTestProp } from '@/utils/tests';
import { IFrameGlobalStyles } from './RenderInIFrame.styled';
import { RESIZABLE_PROP_NAME, Resizable } from '../Resizable';

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

type ApplyHeightToIFrameBodyRef = {
  setHeight: (height: number) => void,
};

const ApplyHeightToIFrameBody = forwardRef<ApplyHeightToIFrameBodyRef, React.PropsWithChildren>((props, ref) => {
  const { document } = useFrame();

  useImperativeHandle(
    ref,
    () => ({
      setHeight: (height: number) => {
        document.body.style.setProperty(RESIZABLE_PROP_NAME, `${height}px`);
      },
    }),
  );

  return null;
});

ApplyHeightToIFrameBody.displayName = 'ApplyHeightToIFrameBody';

export function RenderInIFrame({ children }: React.PropsWithChildren) {
  const [ready, setReady] = useState(false);
  const updateHeightInIFrameRef = useRef<ApplyHeightToIFrameBodyRef>();

  const onLoad = useCallback(() => {
    setReady(true);
  }, []);

  const onChange = useCallback((height: number) => {
    if (updateHeightInIFrameRef.current) updateHeightInIFrameRef.current.setHeight(height);
  }, []);

  return (
    <Resizable
      defaultHeight={160}
      minHeight={160}
      onChange={onChange}
    >
      <Frame
        style={{ opacity: ready ? 1 : 0, height: `var(${RESIZABLE_PROP_NAME})` }}
        {...assignTestProp('richTextFrame')}
        ref={onLoad}
        title="richtext-frame"
      >
        <RenderInIFrameBody>
          {children}
          <ApplyHeightToIFrameBody ref={updateHeightInIFrameRef} />
        </RenderInIFrameBody>
      </Frame>
    </Resizable>
  );
}
