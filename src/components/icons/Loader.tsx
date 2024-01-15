import React from 'react';

import { IconWrapperProps } from './types';

export function Loader(props: IconWrapperProps) {
  return (
    <svg viewBox="0 0 302 304" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="161" cy="40" r="40" />
      <circle opacity="0.2" cx="240.5" cy="69.5" r="22.5" />
      <circle opacity="0.3" cx="274.5" cy="132.5" r="27.5" />
      <circle opacity="0.4" cx="266" cy="205" r="30" />
      <circle opacity="0.5" cx="212" cy="260" r="30" />
      <circle opacity="0.6" cx="133.5" cy="271.5" r="32.5" />
      <circle opacity="0.7" cx="61" cy="228" r="34" />
      <circle opacity="0.8" cx="36" cy="149" r="36" />
      <circle opacity="0.9" cx="72.5" cy="69.5" r="37.5" />
    </svg>
  );
}
