import React, { useCallback, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import { assignTestProp } from '@/utils/tests';

import { useWebBuilderSizeHeight } from '../WebBuilderSize';
import {
  Container, Progress, ProgressIn, Title,
} from './TemplateLoaderAnimation.styled';

type TemplateLoaderAnimationProps = {
  duration: number,
};

export function TemplateLoaderAnimation({ duration }: TemplateLoaderAnimationProps) {
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
    let count = 0;

    const timer = setInterval(() => {
      count += 100;
      const currentProgressPercent = Math.min(Math.floor(count / duration * 100), 100);
      if (currentProgressPercent > progressPercentCounter.current) {
        progressPercentCounter.current = currentProgressPercent;
        progressPercentCounterNode.current.innerHTML = `${currentProgressPercent}%`;

        if (progressPercentBarNode.current) {
          progressPercentBarNode.current.style.width = `${currentProgressPercent}%`;
        }
      }
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [duration]);

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
