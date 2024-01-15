import React from 'react';

import { assignTestProp } from '@/utils/tests';
import { Icon } from '@/components/icons/Icon';
import { Container, IconContainer } from './BreakpointLabel.styled';

type BreakpointLabelProps = {
  label: string,
  testId?: string,
  width?: number,
};

const renderIcon = (width?: number) => {
  if (width === undefined) return <Icon icon={Icon.AddBreakpoint} />;
  if (width < 768) return <Icon icon={Icon.Mobile} />;
  if (width < 1280) return <Icon icon={Icon.Tablet} />;
  return <Icon icon={Icon.Desktop} />;
};

export function BreakpointLabel({
  label,
  testId,
  width,
}: BreakpointLabelProps) {
  return (
    <Container {...assignTestProp(testId)}>
      <IconContainer>
        {renderIcon(width)}
      </IconContainer>
      {label}
    </Container>
  );
}
