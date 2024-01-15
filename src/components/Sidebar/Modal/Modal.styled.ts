import styled from 'styled-components';

import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '@/consts';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  width: 281px;
  max-height: 320px;
  left: ${`${SIDEBAR_WIDTH + 16}px`};
  top: ${`${NAVBAR_HEIGHT + 16}px`};
  z-index: ${({ theme }) => theme.zIndex.max};
`;
