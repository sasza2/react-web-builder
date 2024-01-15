import React from 'react';

import { IconWrapperProps } from './types';

export function TextUnderline(props: IconWrapperProps) {
  return (
    <svg viewBox="0 0 17 16" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M8.71419 13.3333C10.1282 13.3317 11.4838 12.7693 12.4837 11.7695C13.4835 10.7696 14.0459 9.41399 14.0475 7.99999V0.666659C14.0475 0.489848 13.9773 0.320279 13.8523 0.195255C13.7272 0.0702303 13.5577 -7.62939e-06 13.3809 -7.62939e-06C13.204 -7.62939e-06 13.0345 0.0702303 12.9095 0.195255C12.7844 0.320279 12.7142 0.489848 12.7142 0.666659V7.99999C12.7142 9.06086 12.2928 10.0783 11.5426 10.8284C10.7925 11.5786 9.77506 12 8.71419 12C7.65333 12 6.63591 11.5786 5.88577 10.8284C5.13562 10.0783 4.71419 9.06086 4.71419 7.99999V0.666659C4.71419 0.489848 4.64395 0.320279 4.51893 0.195255C4.39391 0.0702303 4.22434 -7.62939e-06 4.04753 -7.62939e-06C3.87072 -7.62939e-06 3.70115 0.0702303 3.57612 0.195255C3.4511 0.320279 3.38086 0.489848 3.38086 0.666659V7.99999C3.38245 9.41399 3.94486 10.7696 4.94471 11.7695C5.94456 12.7693 7.30019 13.3317 8.71419 13.3333Z" />
      <path d="M16.0472 14.6663H1.38053C1.20372 14.6663 1.03415 14.7365 0.909129 14.8615C0.784105 14.9865 0.713867 15.1561 0.713867 15.3329C0.713867 15.5097 0.784105 15.6793 0.909129 15.8043C1.03415 15.9293 1.20372 15.9996 1.38053 15.9996H16.0472C16.224 15.9996 16.3936 15.9293 16.5186 15.8043C16.6436 15.6793 16.7139 15.5097 16.7139 15.3329C16.7139 15.1561 16.6436 14.9865 16.5186 14.8615C16.3936 14.7365 16.224 14.6663 16.0472 14.6663Z" />
    </svg>
  );
}
