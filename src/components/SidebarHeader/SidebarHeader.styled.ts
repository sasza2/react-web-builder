import styled, { css } from 'styled-components';

import { NAVBAR_HEIGHT } from '@/consts';
import { Container as ButtonIcon } from '@/components/ButtonIcon/ButtonIcon.styled';

// textMdBold
export const Center = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${NAVBAR_HEIGHT}px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  box-sizing: border-box;
  position: relative;
  ${({ theme }) => theme.typography.Title0B};
`;

export const ButtonContainer = styled.div`
  position: absolute;
  left: 20px;

  ${ButtonIcon} svg {
    height: 14px;
  }
`;

export const Children = styled.div<{ $hasBackButton: boolean }>`
  word-break: break-word;
  color: ${({ theme }) => theme.colors.gray};
  ${({ $hasBackButton }) => $hasBackButton && css`
    width: 180px;
    margin-left: 60px;
  `};
`;
