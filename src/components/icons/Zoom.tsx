import React from 'react';

import { IconWrapperProps } from './types';

export function Zoom(props: IconWrapperProps) {
  return (
    <svg
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M959.369997 909.993104 697.933422 648.464427c-3.111-3.111-6.621109-5.577286-10.366589-7.419326 53.480547-62.834015 85.787874-144.22146 85.787874-232.997532 0-198.459291-161.505931-359.965222-360.006156-359.965222-198.459291 0-359.965222 161.505931-359.965222 359.965222 0 198.500225 161.505931 360.006156 359.965222 360.006156 83.44439 0 160.34954-28.541379 221.474551-76.383239 1.882974 4.287859 4.584632 8.299411 8.09474 11.80952l261.487743 261.487743c7.593296 7.583063 17.54031 11.379711 27.487323 11.379711 9.947013 0 19.883793-3.796648 27.477089-11.379711C974.597524 949.781158 974.597524 925.179697 959.369997 909.993104zM413.34855 725.850554c-175.239359 0-317.772283-142.563625-317.772283-317.802984S238.109191 90.275287 413.34855 90.275287 731.151535 232.808211 731.151535 408.04757 588.58791 725.850554 413.34855 725.850554z" />
    </svg>
  );
}
