import styled from "styled-components";

export const Line = styled.div<{ $top: number }>`
  border-bottom: 5px dashed ${({ theme }) => theme.colors.strongRed};
  height: 1px;
  max-height: 1px;
  position: absolute;
  top: ${({ $top }) => `${$top - 1}px`};
  width: 100%;
`;
