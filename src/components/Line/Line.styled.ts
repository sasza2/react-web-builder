import styled from 'styled-components';

export const Container = styled.div<{
  $borderRadius: number,
  $height: number,
}>`
  display: flex;
  width: 100%;
  border-radius: ${({ $borderRadius }) => `${$borderRadius}px`};
  height: ${({ $height }) => `${$height}px`};
  max-height: ${({ $height }) => `${$height}px`};
  overflow: hidden;
`;
