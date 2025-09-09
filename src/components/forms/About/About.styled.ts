import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
`;

export const Description = styled.div`
  ${({ theme }) => theme.typography.Small0R};
  color: ${({ theme }) => theme.colors.gray};
`;
