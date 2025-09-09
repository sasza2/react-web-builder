import styled from "styled-components";

export const Container = styled.div`
  .react-toggle {
    width: 50px;
  }

  .react-toggle--focus .react-toggle-thumb {
    box-shadow: none !important;
  }

  .react-toggle--checked .react-toggle-track {
    background-color: ${({ theme }) => theme.colors.seaGreen};
  }
  
  .react-toggle-track {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;
