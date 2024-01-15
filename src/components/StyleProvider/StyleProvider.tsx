import React from 'react';
import { ThemeProvider } from 'styled-components';

import theme from './theme';

export function StyleProvider({ children }: React.PropsWithChildren) {
  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
}
