import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 25px;
  padding: 10px 0 0;
  min-height: 100vh;
  ${({ theme }) => theme.typography.Big0R};
`;
