import { css, styled } from 'styled-components';

export const Container = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 4px;
  display: flex;
  overflow: hidden;
`;

export const Tab = styled.div<{ $selected?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white};
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  color: ${({ theme }) => theme.colors.darkBlue};
  cursor: pointer;
  display: flex;
  height: 30px;
  justify-content: center;
  min-width: 32px;
  padding: 4px;
  width: 100%;

  &:last-child {
    border-right: none;
  }

  ${({ theme }) => theme.typography.Medium0B};

  ${({ $selected }) => $selected && css`
    background-color: ${({ theme }) => theme.colors.darkBlue};
    color: ${({ theme }) => theme.colors.white};
  `};
`;
