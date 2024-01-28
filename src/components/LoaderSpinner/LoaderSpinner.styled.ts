import styled from 'styled-components';

export const Container = styled.div<{ $color: string, $width: number }>`
  svg {
    width: ${({ $width }) => `${$width}px`};
    fill: ${({ $color }) => $color};
    animation: rotate 2s infinite linear;
  }
`;
