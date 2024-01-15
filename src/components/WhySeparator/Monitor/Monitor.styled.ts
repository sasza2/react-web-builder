import styled from 'styled-components';

export const Container = styled.div``;

export const Stand1 = styled.div`
  background-color: ${({ theme }) => theme.colors.black};
  height: 20px;
  border-bottom-left-radius: 10px;
  border-bottom-right-radius: 10px;
`;

export const Stand2 = styled.div`
  margin: 0 auto;
  width: 100px;
  height: 50px;
  clip-path:  polygon(15% 0%, 0% 100%, 100% 100%, 85% 0%);
  background-color: ${({ theme }) => theme.colors.black};
`;

export const Logo = styled.div`
  margin: auto;
  width: 18px;
  height: 18px;
  background-color: ${({ theme }) => theme.colors.white};
  border-radius: 50%;
`;

export const Screen = styled.div`
  border: 8px solid ${({ theme }) => theme.colors.black};
  border-top-left-radius: 10px;
  min-height: 300px;
  border-top-right-radius: 10px;
`;
