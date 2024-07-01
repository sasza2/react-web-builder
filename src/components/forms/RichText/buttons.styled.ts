import styled, { css } from 'styled-components';

export const ButtonWrapper = styled.div<{
  $active: boolean,
  $inline?: boolean,
  $reversed?: boolean,
}>`
  display: ${({ $inline }) => ($inline ? 'inline-flex' : 'flex')};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-radius: 4px;
  background-color: ${({ $active, theme }) => {
    if ($active) return theme.colors.darkBlue;
    return 'transparent';
  }};

  svg {
    width: 16px;
    height: 16px;
    fill: ${({ theme }) => theme.colors.gray};
  }

  ${({ $active }) => $active && css`
    svg {
      fill: ${({ theme }) => theme.colors.white};
    }
  `}

  ${({ $active, $reversed }) => {
    if ($reversed) {
      if ($active) {
        return css`
          color: ${({ theme }) => theme.colors.white};
        `;
      }
      return css`
        color: ${({ theme }) => theme.colors.lightGray};
      `;
    }

    if ($active) {
      return css`
        color: ${({ theme }) => theme.colors.black};
      `;
    }

    return css`
      color: ${({ theme }) => theme.colors.lightGray};
    `;
  }};
`;
