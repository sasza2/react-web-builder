import styled, { css } from 'styled-components';

export const InputGroup = styled.div<{ $hasFocus?: boolean, $height?: number }>`
  display: flex;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  overflow: hidden;
  box-sizing: border-box;
  height: ${({ $height }) => `${$height}px`};
  border-radius: 4px;
  ${({ theme }) => theme.typography.Medium0R};

  ${({ $hasFocus }) => $hasFocus && css`
    border: 1px solid ${({ theme }) => theme.colors.darkBlue};
  `}

  input, textarea {
    background-color: ${({ theme }) => theme.colors.white};
    color: ${({ theme }) => theme.colors.gray};
    border: none;
    height: 100%;
    box-sizing: border-box;
    max-width: 100%;
    text-indent: 10px;
    flex: 1;
    overflow: hidden;

    &:focus {
      outline: none;
    }
  }
`;

export const ExtraNode = styled.div<{ $leftBorder?: boolean, $rightBorder?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.Medium0B};
  padding: 0 8px;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.whiteSmoke};
  color: ${({ theme }) => theme.colors.darkBlue};

  ${({ $leftBorder }) => $leftBorder && css`
    border-left: 1px solid ${({ theme }) => theme.colors.lightGray};
  `}

  ${({ $rightBorder }) => $rightBorder && css`
    border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  `}
`;
