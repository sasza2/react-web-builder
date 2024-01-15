import styled from 'styled-components';

import { NAVBAR_HEIGHT } from '@/consts';

export const Wrapper = styled.div<{ $height: number }>`
  max-height: ${({ $height }) => `${$height - NAVBAR_HEIGHT}px`};
  height: ${({ $height }) => `${$height - NAVBAR_HEIGHT}px`};
`;

export const Empty = styled.div`
  height: 170px;
`;
