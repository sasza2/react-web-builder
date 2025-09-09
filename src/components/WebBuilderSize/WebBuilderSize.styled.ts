import styled from "styled-components";

export const Container = styled.div<{ $maxHeight: number }>`
  position: relative;
  height: 100%;
  width: 100%;
  font-size: 16px;
  max-height: ${({ $maxHeight }) => `${$maxHeight}px`};
  min-height: 200px;
  overflow: hidden;
`;
