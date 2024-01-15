import React, { useEffect, useState } from 'react';
import { TFunction } from 'i18next';
import { useTranslation } from 'react-i18next';

import { HelperArrow } from '../Hints/HelperArrow/HelperArrow';
import { AnimationWidth } from './AnimationWidth';
import { AnimationSeparator, Boxes } from './Boxes';
import { Monitor } from './Monitor';
import { ScaleAnimation } from './ScaleAnimation';
import { Container } from './WhySeparator.styled';
import { Box4, SeparatorDiv } from './Boxes/Boxes.styled';

const MIN_WIDTH = 420; // px
const MAX_WIDTH = 900; // px

type WhySeparatorProps = {
  onClose?: () => void,
};

enum AnimationType {
  ExtendWithoutSeparator,
  CollapseWithoutSeparator,
  ShowSeparator,
  ExtendWithSeparator,
  CollapseWithSeparator,
  HideSeparator,
  None,
}

type AnimationState = {
  animationSeparator?: AnimationSeparator,
  arrow?: {
    selector: string,
    title: string,
  },
  id: AnimationType,
  speed: number,
  to: number,
  hasSeparator: boolean,
};

const createAnimations = (t: TFunction): AnimationState[] => [
  {
    id: AnimationType.ExtendWithoutSeparator,
    speed: 5000,
    to: MIN_WIDTH,
    hasSeparator: false,
    arrow: {
      selector: Box4.toString(),
      title: t('whySeparator.moveVerticaly'),
    },
  },
  {
    id: AnimationType.ExtendWithoutSeparator,
    speed: 3000,
    to: MAX_WIDTH,
    hasSeparator: false,
  },
  {
    id: AnimationType.CollapseWithoutSeparator,
    speed: 3000,
    to: MIN_WIDTH,
    hasSeparator: false,
  },
  {
    id: AnimationType.ShowSeparator,
    speed: 0,
    to: MIN_WIDTH,
    hasSeparator: true,
  },
  {
    id: AnimationType.None,
    animationSeparator: AnimationSeparator.Show,
    speed: 1000,
    to: MIN_WIDTH,
    hasSeparator: true,
  },
  {
    id: AnimationType.None,
    animationSeparator: AnimationSeparator.Show,
    speed: 5000,
    to: MIN_WIDTH,
    hasSeparator: true,
    arrow: {
      selector: SeparatorDiv.toString(),
      title: t('separator.why'),
    },
  },
  {
    id: AnimationType.ExtendWithSeparator,
    animationSeparator: AnimationSeparator.Show,
    speed: 3000,
    to: MAX_WIDTH,
    hasSeparator: true,
  },
  {
    id: AnimationType.None,
    animationSeparator: AnimationSeparator.Show,
    speed: 5000,
    to: MAX_WIDTH,
    hasSeparator: true,
    arrow: {
      selector: Box4.toString(),
      title: t('whySeparator.sticksHorizontally'),
    },
  },
  {
    id: AnimationType.CollapseWithSeparator,
    animationSeparator: AnimationSeparator.Show,
    speed: 3000,
    to: MIN_WIDTH,
    hasSeparator: true,
  },
  {
    animationSeparator: AnimationSeparator.Hide,
    id: AnimationType.HideSeparator,
    speed: 1000,
    to: MIN_WIDTH,
    hasSeparator: true,
  },
];

export function WhySeparator({ onClose }: WhySeparatorProps) {
  const { t } = useTranslation();
  const [animationIndex, setAnimationIndex] = useState(0);
  const animations = createAnimations(t);
  const {
    animationSeparator,
    arrow,
    speed,
    to,
    hasSeparator,
  } = animations[animationIndex];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      onClose();
    };

    window.addEventListener('click', onClick);

    return () => {
      window.removeEventListener('click', onClick);
    };
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationIndex(() => {
        const nextAnimationIndex = animationIndex + 1;
        if (nextAnimationIndex >= animations.length) return 0;
        return nextAnimationIndex;
      });
    }, speed);

    return () => {
      clearTimeout(timer);
    };
  }, [animationIndex, speed]);

  return (
    <Container onClick={onClose}>
      *
      {' '}
      {t('whySeparator.close')}
      <ScaleAnimation maxWidth={MAX_WIDTH}>
        <AnimationWidth from={MIN_WIDTH} to={to} speed={speed}>
          <Monitor>
            <Boxes
              animationSpeed={speed}
              animationSeparator={animationSeparator}
              hasSeparator={hasSeparator}
            />
          </Monitor>
        </AnimationWidth>
      </ScaleAnimation>
      { arrow && (
        <HelperArrow
          {...arrow}
          hasButton={false}
        />
      ) }
    </Container>
  );
}
