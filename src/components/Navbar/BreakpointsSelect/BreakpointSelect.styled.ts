import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 18px 0 auto;
  width: 250px;
  height: 40px;
  ${({ theme }) => theme.typography.Title0R};
`;
