import styled from 'styled-components';

export const Empty = styled.div<{ $height: number }>`
  width: 100%;
  height: ${({ $height }) => `${$height}px`};
  border: 2px solid ${({ theme }) => theme.colors.black};
  background-color: ${({ theme }) => theme.colors.lightGray};
`;

export const Container = styled.div`
  display: flex;
  overflow: hidden;

  iframe {
    border: none;
  }
`;
