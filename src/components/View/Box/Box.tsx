import React, { memo } from 'react';
import { BoxProps } from 'types';

import { Empty } from './Box.styled';
import { Element, ElementProps } from './Element';
import { Leaf } from './Leaf';
import { useBoxStyle } from './useBoxStyle';

function BoxComponent({
  backgroundColor,
  border = {},
  boxShadow,
  content,
  padding = {},
}: BoxProps) {
  const style = useBoxStyle({
    backgroundColor,
    border,
    boxShadow,
    padding,
  });

  const renderContent = () => {
    if (typeof content === 'string') return content;

    if (!Array.isArray(content)) {
      return <div>Error when rendering component</div>; // TODO
    }

    return content.map((itemContent, index) => {
      const children = itemContent.children.filter((child) => child.text);
      if (!children.length) return <Empty key={`empty-${index}`} />; // eslint-disable-line
      return (
        <Element
          key={index} // eslint-disable-line
          element={itemContent as ElementProps['element']}
          attributes={{ align: itemContent.align }}
        >
          {children.map((leaf, leafIndex) => (
            <Leaf
              key={leafIndex} // eslint-disable-line
              leaf={leaf}
              attributes={{}}
            >
              {leaf.text}
            </Leaf>
          ))}
        </Element>
      );
    });
  };

  return (
    <div className="react-web-builder-component-box" style={style}>
      {renderContent()}
    </div>
  );
}

export const Box: React.FC<BoxProps> = memo(BoxComponent);

export default Box;
