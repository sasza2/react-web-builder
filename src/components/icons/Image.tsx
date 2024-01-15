import React from 'react';

import { IconWrapperProps } from './types';

export function Image(props: IconWrapperProps) {
  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      {...props}
    >
      <path d="M15.8333 0H4.16667C3.062 0.00132321 2.00296 0.440735 1.22185 1.22185C0.440735 2.00296 0.00132321 3.062 0 4.16667L0 15.8333C0.00132321 16.938 0.440735 17.997 1.22185 18.7782C2.00296 19.5593 3.062 19.9987 4.16667 20H15.8333C16.938 19.9987 17.997 19.5593 18.7782 18.7782C19.5593 17.997 19.9987 16.938 20 15.8333V4.16667C19.9987 3.062 19.5593 2.00296 18.7782 1.22185C17.997 0.440735 16.938 0.00132321 15.8333 0ZM4.16667 1.66667H15.8333C16.4964 1.66667 17.1323 1.93006 17.6011 2.3989C18.0699 2.86774 18.3333 3.50363 18.3333 4.16667V15.8333C18.3319 16.2046 18.2464 16.5707 18.0833 16.9042L10.4475 9.26833C10.0606 8.88131 9.6012 8.57429 9.0956 8.36483C8.59001 8.15537 8.0481 8.04756 7.50083 8.04756C6.95357 8.04756 6.41166 8.15537 5.90606 8.36483C5.40047 8.57429 4.94109 8.88131 4.55417 9.26833L1.66667 12.155V4.16667C1.66667 3.50363 1.93006 2.86774 2.3989 2.3989C2.86774 1.93006 3.50363 1.66667 4.16667 1.66667ZM4.16667 18.3333C3.50363 18.3333 2.86774 18.0699 2.3989 17.6011C1.93006 17.1323 1.66667 16.4964 1.66667 15.8333V14.5117L5.73167 10.4467C5.96383 10.2144 6.2395 10.0301 6.54292 9.90432C6.84634 9.77858 7.17156 9.71387 7.5 9.71387C7.82844 9.71387 8.15366 9.77858 8.45708 9.90432C8.7605 10.0301 9.03617 10.2144 9.26833 10.4467L16.9042 18.0833C16.5707 18.2464 16.2046 18.3319 15.8333 18.3333H4.16667Z" />
      <path d="M13.3334 8.75C13.9103 8.75 14.4742 8.57894 14.9538 8.25845C15.4335 7.93796 15.8073 7.48244 16.0281 6.94949C16.2488 6.41654 16.3066 5.8301 16.194 5.26432C16.0815 4.69854 15.8037 4.17884 15.3958 3.77094C14.9879 3.36303 14.4682 3.08525 13.9024 2.97271C13.3366 2.86017 12.7502 2.91793 12.2173 3.13868C11.6843 3.35944 11.2288 3.73328 10.9083 4.21292C10.5878 4.69256 10.4167 5.25647 10.4167 5.83333C10.4167 6.60688 10.724 7.34875 11.271 7.89573C11.818 8.44271 12.5599 8.75 13.3334 8.75ZM13.3334 4.58333C13.5806 4.58333 13.8223 4.65664 14.0279 4.794C14.2334 4.93135 14.3937 5.12657 14.4883 5.35498C14.5829 5.58339 14.6076 5.83472 14.5594 6.0772C14.5112 6.31967 14.3921 6.5424 14.2173 6.71722C14.0425 6.89203 13.8198 7.01108 13.5773 7.05931C13.3348 7.10755 13.0835 7.08279 12.8551 6.98818C12.6267 6.89357 12.4314 6.73336 12.2941 6.5278C12.1567 6.32223 12.0834 6.08056 12.0834 5.83333C12.0834 5.50181 12.2151 5.18387 12.4495 4.94945C12.684 4.71503 13.0019 4.58333 13.3334 4.58333Z" />
    </svg>
  );
}
