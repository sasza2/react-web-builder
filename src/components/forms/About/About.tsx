import React, { useCallback } from 'react';
import { WebBuilderComponentPropertyAbout } from 'types';

import { LinkButton } from '@/components/Button';
import { useWebBuilderProperties } from '@/components/PropertiesProvider';

import { ButtonContainer, Container, Description } from './About.styled';

type AboutProps = Pick<WebBuilderComponentPropertyAbout, 'button' | 'description'>;

export function About({
  button,
  description,
}: AboutProps) {
  const { onAboutClick } = useWebBuilderProperties();

  const onClick = useCallback(() => {
    if (button && onAboutClick) onAboutClick(button);
  }, [button, onAboutClick]);

  return (
    <Container>
      { description && <Description>{description}</Description> }
      { button && button.label && (
        <ButtonContainer onClick={onClick}>
          <LinkButton>
            {button.label}
          </LinkButton>
        </ButtonContainer>
      )}
    </Container>
  );
}
