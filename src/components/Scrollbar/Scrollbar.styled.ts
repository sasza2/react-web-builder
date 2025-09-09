import styled from "styled-components";

export const Container = styled.div`
  overflow-y: scroll;
  max-height: 100%;
  height: 100%;
  scrollbar-color: ${({ theme }) => theme.colors.lightGray} transparent;

  &::-webkit-scrollbar {
    width: 5px;
  }
    
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: ${({ theme }) => theme.colors.lightGray};
    cursor: pointer;
  }
`;
