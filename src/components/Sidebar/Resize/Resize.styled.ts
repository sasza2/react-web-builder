import { styled } from "styled-components";

export const Container = styled.div<{ $height: number }>`
  cursor: ew-resize;
  left: var(--react-web-builder-sidebar-width);
  top: 0;
  height: ${({ $height }) => `${$height}px`};
  position: absolute;
  width: 3px;
`;
