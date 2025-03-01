import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { assignTestProp } from '@/utils/tests';

import { useWebBuilderSizeHeight } from '../WebBuilderSize';
import {
  Container, Progress, ProgressIn, Title,
} from './TemplateLoaderAnimation.styled';

export function TemplateLoaderAnimation() {
  const { t } = useTranslation();
  const webBuilderHeight = useWebBuilderSizeHeight();
  const progressPercentCounter = useRef<number>(0);
  const progressPercentCounterNode = useRef<HTMLSpanElement>();
  const progressPercentBarNode = useRef<HTMLDivElement>();

  const onInitProgressPercentNode = useCallback((node: HTMLSpanElement) => {
    if (!node) return;
    progressPercentCounterNode.current = node;
    node.innerHTML = '0%';
  }, []);

  useEffect(() => {
    let currentProgressPercent = 0;

    const timer = setInterval(() => {
      if (currentProgressPercent > progressPercentCounter.current) {
        progressPercentCounter.current = currentProgressPercent;
        progressPercentCounterNode.current.innerHTML = `${Math.floor(currentProgressPercent)}%`;

        if (progressPercentBarNode.current) {
          progressPercentBarNode.current.style.width = `${currentProgressPercent}%`;
        }
      }

      currentProgressPercent += (100 - currentProgressPercent) / 10;
    }, 200);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <Container
      $height={webBuilderHeight}
      {...assignTestProp('templateLoaderAnimation')}
    >
      <Title>
        {t('template.loading')}
        {' '}
        <span ref={onInitProgressPercentNode} />
      </Title>
      <Progress>
        <ProgressIn ref={progressPercentBarNode} />
      </Progress>
    </Container>
  );
}
