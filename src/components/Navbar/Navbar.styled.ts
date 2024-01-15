import styled, { css } from 'styled-components';

import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from '@/consts';

export const Wrapper = styled.div`
  padding: 0 15px;
  display: flex;
  align-items: center;
  width: ${() => `calc(100% - ${SIDEBAR_WIDTH}px)`};
  left: ${() => `${SIDEBAR_WIDTH}px`};
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  height: ${NAVBAR_HEIGHT}px;
  z-index: 2;
`;

export const Options = styled.div<{ $toLeft?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0px 18px;

  ${({ $toLeft }) => $toLeft && css`
    margin-left: auto;
  `};
`;
