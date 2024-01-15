import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
`;

export const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  color: ${({ theme }) => theme.colors.gray};

  svg {
    height: 20px;
  }
`;
