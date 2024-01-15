import React from 'react';

import {
  Container, Logo, Screen, Stand1, Stand2,
} from './Monitor.styled';

export function Monitor({ children }: React.PropsWithChildren) {
  return (
    <Container>
      <Screen>
        {children}
      </Screen>
      <Stand1>
        <Logo />
      </Stand1>
      <Stand2 />
    </Container>
  );
}
