import React from 'react';

import { ButtonIcon } from '../ButtonIcon';
import { Icon } from '../icons/Icon';
import { ButtonContainer, Center, Children } from './SidebarHeader.styled';

type SidebarHeaderProps = React.PropsWithChildren<{
  onBack?: () => void,
}>;

export function SidebarHeader({ children, onBack }: SidebarHeaderProps) {
  return (
    <Center>
      { onBack && (
      <ButtonContainer>
        <ButtonIcon testId="sidebarBack" onClick={onBack}>
          <Icon
            icon={Icon.ArrowLeft}
          />
        </ButtonIcon>
      </ButtonContainer>
      ) }
      <Children $hasBackButton={!!onBack}>
        {children}
      </Children>
    </Center>
  );
}
