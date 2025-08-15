import styled, { css } from 'styled-components';

const getSize = (big: string, small: string) => ({ $size }: { $size?: 'big' | 'small' }) => ($size === 'small' ? small : big);

export const Container = styled.button<{
  $active?: boolean,
  $disabled?: boolean,
  $transparent?: boolean,
  $size?: 'big' | 'small',
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${getSize('40px', '24px')};
  height: ${getSize('40px', '24px')};
  border-radius: 8px;
  padding: 0;

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
    width: ${getSize('20px', '12px')};
    height: ${getSize('20px', '12px')};
  }

`;
