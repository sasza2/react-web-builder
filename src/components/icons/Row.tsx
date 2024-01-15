import React from 'react';

import { IconWrapperProps } from './types';

export function Row(props: IconWrapperProps) {
  return (
    <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M19.1667 3.33332H0.833333C0.375 3.33332 0 2.95832 0 2.49999C0 2.04166 0.375 1.66666 0.833333 1.66666H19.1667C19.625 1.66666 20 2.04166 20 2.49999C20 2.95832 19.625 3.33332 19.1667 3.33332ZM20 17.5C20 17.0417 19.625 16.6667 19.1667 16.6667H0.833333C0.375 16.6667 0 17.0417 0 17.5C0 17.9583 0.375 18.3333 0.833333 18.3333H19.1667C19.625 18.3333 20 17.9583 20 17.5ZM16.6667 10.8333V9.16666C16.6667 7.32499 15.175 5.83332 13.3333 5.83332H6.66667C4.825 5.83332 3.33333 7.32499 3.33333 9.16666V10.8333C3.33333 12.675 4.825 14.1667 6.66667 14.1667H13.3333C15.175 14.1667 16.6667 12.675 16.6667 10.8333ZM13.3333 7.49999C14.25 7.49999 15 8.24999 15 9.16666V10.8333C15 11.75 14.25 12.5 13.3333 12.5H6.66667C5.75 12.5 5 11.75 5 10.8333V9.16666C5 8.24999 5.75 7.49999 6.66667 7.49999H13.3333Z" />
    </svg>
  );
}
