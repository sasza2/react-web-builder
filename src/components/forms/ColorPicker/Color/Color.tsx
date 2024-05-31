import React, { useId, useMemo } from 'react';
import { Tooltip } from 'react-tooltip';

import { assignTestProp } from '@/utils/tests';
import { ColorType, getColorForTooltip } from '@/utils/colors';
import { getColorType } from '@/utils/colors/common';
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
  const colorType = useMemo(() => getColorType(color), [color]);
  const isGradient = colorType === ColorType.Gradient;

  return (
    <ColorContainer
      $active={active}
      $size={colorSize}
      onClick={onClick}
      data-tooltip-id={tooltipId}
      {...assignTestProp('color', null, isGradient ? null : getColorForTooltip(color))}
    >
      <ColorDiv $color={color} $size={colorSize} />
      {!isGradient && (
        <Tooltip id={tooltipId}>
          {getColorForTooltip(color)}
        </Tooltip>
      )}
    </ColorContainer>
  );
}
