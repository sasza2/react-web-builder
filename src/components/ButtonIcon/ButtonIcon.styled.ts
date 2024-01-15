import styled, { css } from 'styled-components';

export const Container = styled.button<{
  $active?: boolean,
  $disabled?: boolean,
  $transparent?: boolean,
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 8px;

  ${({ $active, $disabled }) => !$active && !$disabled && css`
    &:hover {
      cursor: pointer;
      border: 1px solid ${({ theme }) => theme.colors.darkBlue};
      transition: all 0.3s;

      svg {
        fill: ${({ theme }) => theme.colors.darkBlue};
      }
    }
  `};

  ${({ $active, $disabled, $transparent }) => {
    if ($active) {
      return css`
        cursor: pointer;
        background-color: ${({ theme }) => ($transparent ? undefined : theme.colors.darkBlue)};
        border: 1px solid ${({ theme }) => theme.colors.darkBlue};
        transition: all 0.3s;

        svg {
          fill: ${({ theme }) => theme.colors.white};
        }
      `;
    }

    if ($disabled) {
      return css`
        cursor: default;
        background-color: ${({ theme }) => theme.colors.white};
        border: 1px solid ${({ theme }) => theme.colors.lightGray};

        svg {
          fill: ${({ theme }) => theme.colors.lightGray};
        }
      `;
    }

    return css`
      cursor: pointer;
      background-color: ${({ theme }) => theme.colors.white};
      border: 1px solid ${({ theme }) => theme.colors.lightGray};

      svg {
        fill: ${({ theme }) => theme.colors.gray};
      }
    `;
  }}

  svg {    
    width: 20px;
    height: 20px;
  }

`;
