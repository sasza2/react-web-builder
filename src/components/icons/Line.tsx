import React from 'react';

import type { IconWrapperProps } from './types';

export function Line(props: IconWrapperProps) {
  return (
    <svg viewBox="0 0 20 2" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.1667 1.83329H0.833333C0.375 1.83329 0 1.45829 0 0.999959C0 0.541626 0.375 0.166626 0.833333 0.166626H19.1667C19.625 0.166626 20 0.541626 20 0.999959C20 1.45829 19.625 1.83329 19.1667 1.83329Z" />
    </svg>
  );
}
