import styled from 'styled-components';

export const Container = styled.a<{ $color: string }>`
  color: ${({ $color }) => $color};
  text-decoration: none;
`;
