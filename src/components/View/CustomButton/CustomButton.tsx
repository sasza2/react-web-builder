import React, { memo, useMemo } from 'react';

import {
  Border, ElementURL, ILeaf, Padding,
} from 'types';
import { Box } from '../Box';
import { Container } from './CustomButton.styled';

type IElement = {
  children: ILeaf[]
  align?: string,
  type: string,
};

type BoxProps = {
  backgroundColor: string,
  border: Partial<Border>,
  color: string,
  content: IElement[],
  padding: Partial<Padding>,
  url?: ElementURL,
};

function CustomButtonComponent({
  backgroundColor,
  border = {},
  color,
  content,
  padding = {},
  url,
}: BoxProps) {
  const contentWithColor = useMemo(() => {
    if (color && Array.isArray(content)) {
      return content.map((item) => {
        const children = Array.isArray(item.children)
          ? item.children.map((child) => ({ ...child, color }))
          : item.children;

        return {
          ...item,
          children,
        };
      });
    }

    return content;
  }, [color, content]);

  return (
    <Container
      className="react-web-builder-component-custom-button"
      $color={color}
      href={url.location}
      target={url.openInNewTab ? '_blank' : undefined}
    >
      <Box
        backgroundColor={backgroundColor}
        border={border}
        content={contentWithColor}
        padding={padding}
      />
    </Container>
  );
}

export const CustomButton: React.FC<BoxProps> = memo(CustomButtonComponent);
