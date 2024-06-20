import React, {
  memo, useEffect, useRef, useState,
} from 'react';

import { WAIT_FOR_LOAD } from '@/consts';
import { assignTestProp } from '@/utils/tests';
import { ComponentIsLoading } from '../../ComponentIsLoading';
import { ComponentNotFound } from '../../ComponentNotFound';
import { ComponentContainer, StateContainer } from './RenderWebComponent.styled';

type RenderWebComponentInProps = React.PropsWithChildren<{
  display?: React.CSSProperties['flex'],
}>;

function RenderWebComponentIn({ children, display }: RenderWebComponentInProps) {
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const containerRef = useRef<HTMLDivElement>();

  useEffect(() => {
    if (loading) return;

    const isLoadingTimer = setTimeout(() => {
      if (containerRef.current.innerHTML) return;
      setLoading(true);
    }, WAIT_FOR_LOAD);

    return () => {
      clearTimeout(isLoadingTimer);
    };
  }, [loading]);

  useEffect(() => {
    if (hasError || !loading) return;

    let retries = 0;
    const maxRetries = 20;

    const waitForLoadTimer = setInterval(() => {
      retries++;
      if (retries >= maxRetries) {
        clearInterval(waitForLoadTimer);
        setHasError(true);
        return;
      }

      if (containerRef.current.innerHTML) {
        setHasError(false);
        setLoading(false);
      }
    }, WAIT_FOR_LOAD);

    return () => {
      clearInterval(waitForLoadTimer);
    };
  }, [hasError, loading]);

  return (
    <>
      { loading && !hasError && (
        <StateContainer>
          <ComponentIsLoading />
        </StateContainer>
      ) }
      { hasError && (
        <StateContainer>
          <ComponentNotFound />
        </StateContainer>
      ) }
      <ComponentContainer $display={display} ref={containerRef} {...assignTestProp('component')}>
        {children}
      </ComponentContainer>
    </>
  );
}

export const RenderWebComponent = memo(RenderWebComponentIn);
