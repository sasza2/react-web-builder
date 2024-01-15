import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100vw;
  z-index: ${({ theme }) => theme.zIndex.max};
`;
