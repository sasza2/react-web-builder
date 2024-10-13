import React, {
  memo, useCallback, useState,
} from 'react';

import { Separator } from '@/components/Separator';

import {
  Box1, Box2, Box3, Box4, ContainerSeparator, ContainerWithout, Left, Right, SeparatorDiv,
} from './Boxes.styled';

export enum AnimationSeparator {
  Show,
  Hide,
}

type BoxesProps = {
  animationSeparator?: AnimationSeparator,
  animationSpeed?: number,
  hasSeparator?: boolean,
};

function BoxesIn({
  animationSeparator,
  animationSpeed = 0,
  hasSeparator,
}: BoxesProps) {
  const [height, setHeight] = useState<number>(undefined);

  const onTextNodeInit = useCallback((node: HTMLDivElement) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    setHeight(rect.height);
  }, [hasSeparator]);

  const box2 = (
    <Box2 ref={onTextNodeInit}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit.
      Maecenas vel tellus in libero sollicitudin eleifend.
    </Box2>
  );

  const box1 = (
    <Box1 style={{ height }} />
  );

  const separatorStyle = {
    '--speed': `${animationSpeed}ms`,
  } as React.CSSProperties;

  const renderBoxes = () => (
    <>
      { hasSeparator && (
        <>
          {box1}
          {box2}
          <SeparatorDiv
            $hidden={animationSeparator === AnimationSeparator.Hide}
            style={separatorStyle}
          >
            <Separator />
          </SeparatorDiv>
        </>
      )}
      { !hasSeparator && (
        <>
          <Left>
            {box1}
            <Box3 />
          </Left>
          <Right>
            {box2}
            <Box4 />
          </Right>
        </>
      )}
      { hasSeparator && (
        <>
          <Box3 />
          <Box4 />
        </>
      )}
    </>
  );

  if (hasSeparator) {
    return (
      <ContainerSeparator>
        {renderBoxes()}
      </ContainerSeparator>
    );
  }

  return (
    <ContainerWithout>
      {renderBoxes()}
    </ContainerWithout>
  );
}

export const Boxes = memo(BoxesIn);
