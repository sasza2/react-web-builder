import React from 'react';

import { FontImport } from 'types';

export const fonts: FontImport[] = [
  {
    label: 'Roboto',
    value: 'roboto',
    fontFamily: "'Roboto', sans-serif",
    stylesheet: (
      <>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
      </>
    ),
  },
  {
    label: 'Lato',
    value: 'lato',
    fontFamily: "'Lato', sans-serif",
    stylesheet: (
      <link href="https://fonts.googleapis.com/css2?family=Lato:wght@400;700&family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
    ),
  },
];
