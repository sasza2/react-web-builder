import styled from 'styled-components';

export const Container = styled.div<{ $disabled?: boolean }>`
  margin: 0 18px 0 auto;
  width: 250px;
  height: 40px;
  ${({ theme }) => theme.typography.Title0R};
`;

export const Disabled = styled.div`
  border-radius: 4px;
  height: 40px;
`;
