import styled from "styled-components";

export const Wrapper = styled.div<{ $height?: number }>`
  box-sizing: border-box;
  background-color: ${({ theme }) => theme.colors.strongRed};
  height: ${({ $height }) => ($height === undefined ? "100%" : `${$height}px`)};
`;
