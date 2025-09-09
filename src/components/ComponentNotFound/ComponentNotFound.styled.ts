import styled from "styled-components";

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.black};
  outline: 1px solid ${({ theme }) => theme.colors.strongRed};
`;
