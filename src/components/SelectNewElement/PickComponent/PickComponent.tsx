import React from 'react';
import type { WebBuilderComponent } from 'types';

import { Icon } from '@/components/icons/Icon';
import { isSeparator } from '@/utils/element';

import { WhySeparatorTooltip } from '../../WhySeparatorTooltip';
import { Container, IconContainer, TooltipContainer } from './PickComponent.styled';

type PickComponentProps = {
  active?: boolean,
  component: WebBuilderComponent,
  onClick?: React.MouseEventHandler,
};

export function PickComponent({
  active,
  component,
  onClick,
}: PickComponentProps) {
  const onClickWrapper: React.MouseEventHandler = (e) => {
    if (component.id === 'Separator') {
      const tooltipContainer = document.querySelector(TooltipContainer.toString());
      const isNotDefined = !tooltipContainer || !e.target;
      if (isNotDefined || !tooltipContainer.contains(e.target as HTMLDivElement)) return onClick(e);
      return;
    }
    onClick(e);
    e.preventDefault();
  };
  return (
    <Container
      key={component.id}
      data-id="component"
      onMouseDown={onClickWrapper}
      $active={active}
      $overflow={isSeparator(component) ? 'visible' : 'hidden'}
    >
      { component.id === 'Separator' && (
        <TooltipContainer>
          <WhySeparatorTooltip />
        </TooltipContainer>
      )}
      <IconContainer>
        <Icon icon={component.icon || Icon.QuestionMark} />
      </IconContainer>
      <span>{component.label || component.id}</span>
    </Container>
  );
}
