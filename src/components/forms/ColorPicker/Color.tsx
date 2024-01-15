import React, { useId } from 'react';
import { Tooltip } from 'react-tooltip';

import { assignTestProp } from '@/utils/tests';
import { getColorForTooltip } from '@/utils/colors';
import { ColorContainer, Color as ColorDiv } from './Color.styled';

type ColorProps = {
  active?: boolean,
  color: string,
  size?: 'xs' | 'lg'
  onClick?: React.MouseEventHandler;
};

export function Color({
  active, color, size, onClick,
}: ColorProps) {
  const id = useId();
  const colorSize = size === 'lg' ? 32 : 24;
  const tooltipId = `color-${id}`;
  return (
    <ColorContainer
      $active={active}
      $size={colorSize}
      onClick={onClick}
      data-tooltip-id={tooltipId}
      {...assignTestProp('color', null, getColorForTooltip(color))}
    >
      <ColorDiv $color={color} $size={colorSize} />
      <Tooltip id={tooltipId}>
        {getColorForTooltip(color)}
      </Tooltip>
    </ColorContainer>
  );
}
