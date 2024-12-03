import React from 'react';

import { Icon } from '@/components/icons/Icon';
import { AllIcons } from '@/components/icons/types';
import { StyleProvider } from '@/components/StyleProvider';

import { IconContainer, IconDiv, IconsContainer } from './Icons.styled';

export function Icons() {
  const icons: Array<[keyof AllIcons, React.FC]> = Object
    .keys(Icon)
    .map<[keyof AllIcons, React.FC]>((key: keyof AllIcons) => [key, Icon[key]])
    .filter(([key]) => !key.startsWith('__docgen'));

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

const meta = {
  component: Icons,
  title: 'Common/Icons',
};

export default meta;
