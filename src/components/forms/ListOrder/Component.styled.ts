import styled from 'styled-components';

export const ComponentBox = styled.div<{ $height: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: ${({ $height }) => `${$height}px`};
  color: ${({ theme }) => theme.colors.gray};
`;
