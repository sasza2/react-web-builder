import { SIDEBAR_WIDTH } from '@/consts';
import styled from 'styled-components';

export const Container = styled.div<{ $height: number }>`
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  position: absolute;
  top: 0px;
  width: ${() => `${SIDEBAR_WIDTH}px`};
  background-color: ${({ theme }) => theme.colors.white};
  overflow: hidden;
  height: ${({ $height }) => `${$height}px`};
  z-index: 2;

  * {
    box-sizing: border-box;
  }
`;
