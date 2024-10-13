import React, { useMemo } from 'react';
import { ToastContainer as LibToastContainer } from 'react-toastify';
import { useTheme } from 'styled-components';

import { ToastContainerStyles } from './ToastContainer.styled';

export function ToastContainer() {
  const theme = useTheme();
  const style = useMemo(() => ({
    '--toastify-icon-color-success': theme.colors.seaGreen,
  } as React.CSSProperties), [theme]);

  return (
    <ToastContainerStyles style={style}>
      <LibToastContainer
        position="top-center"
      />
    </ToastContainerStyles>
  );
}
