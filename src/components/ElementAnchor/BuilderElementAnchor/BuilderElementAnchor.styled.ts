import { styled } from "styled-components";

export const Container = styled.div<{ $rowHeight: number }>`
  align-items: center;
  background-color: #ffff00;
  display: flex;
  height: ${({ $rowHeight }) => $rowHeight}px;
  justify-content: center;
`;
