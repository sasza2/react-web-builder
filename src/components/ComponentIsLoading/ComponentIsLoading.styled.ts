import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

export const Label = styled.div`
  color: ${({ theme }) => theme.colors.black};
`;

export const Loader = styled.div`
  svg {
    width: 15px;
    fill: ${({ theme }) => theme.colors.darkBlue};
    animation: rotate 2s infinite linear;
  }
`;
