import styled from "styled-components";

import { ButtonWrapper } from "../../RichText/buttons.styled";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  .sketch-picker {
    padding: 0px !important;
    box-shadow: none !important;
    font-family: ${({ theme }) => theme.fontFamily};
  }
`;

export const Label = styled.div`
  ${({ theme }) => theme.typography.Medium0R};

  ${ButtonWrapper} {
    margin: 0 5px;
  }
`;
