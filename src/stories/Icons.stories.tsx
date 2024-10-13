import React from 'react';

import { Icon } from '@/components/icons/Icon';
import { AllIcons } from '@/components/icons/types';
import { StyleProvider } from '@/components/StyleProvider';

import { IconContainer, IconDiv, IconsContainer } from './Icons.styled';

export default { title: 'Icons' };

export function Icons() {
  const icons: Array<[keyof AllIcons, React.FC]> = Object
    .keys(Icon)
    .map((key: keyof AllIcons) => [key, Icon[key]]);

  return (
    <StyleProvider>
      <IconsContainer>
        {icons.map(([key, icon]) => (
          <IconContainer key={key}>
            <Icon className={IconDiv.toString()} icon={icon} />
            {key}
          </IconContainer>
        ))}
      </IconsContainer>
    </StyleProvider>
  );
}
