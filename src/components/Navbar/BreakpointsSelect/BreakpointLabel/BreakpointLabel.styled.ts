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
    position: relative;
    left: -2px;
    height: 20px;
  }
`;
