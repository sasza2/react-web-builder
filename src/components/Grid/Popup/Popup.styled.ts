import styled from 'styled-components';

export const WIDTH = 230; // px

export const Container = styled.div<{ $left: number, $top: number }>`
  position: fixed;
  left: ${({ $left }) => `${$left}px`};
  top: ${({ $top }) => `${$top}px`};
  width: ${`${WIDTH}px`};
`;
