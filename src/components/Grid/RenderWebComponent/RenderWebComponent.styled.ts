import styled from 'styled-components';

export const StateContainer = styled.div`
  position: absolute;
  top: 0;
`;

export const ComponentContainer = styled.div<{ $display?: React.CSSProperties['flex'] }>`
  display: ${({ $display }) => $display};
  position: relative;
`;
