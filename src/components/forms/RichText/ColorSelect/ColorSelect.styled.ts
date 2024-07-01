import styled from 'styled-components';

export const Container = styled.div``;

export const ColorIcon = styled.div`
  margin: 4px;
  width: 18px;
  height: 18px;
  min-width: 18px;
  border-radius: 4px;
  box-shadow: 0px 1px 4px 0px ${({ theme }) => `${theme.colors.black}1A`} inset;
`;
