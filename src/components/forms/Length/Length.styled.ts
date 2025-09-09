import styled from "styled-components";

import { InputGroup } from "../Input/Input.styled";
import { Container as TabsContainer } from "../Tabs/Tabs.styled";

export const FormContainer = styled.div`
  display: flex;
  gap: 8px;
  width: 100%;
`;

export const InputContainer = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.gray};
  display: flex;

  ${InputGroup} {
    background-color: red !important;
    border-radius: 4px 0 0 4px;

    input {
      text-align: center;
      width: 100%;
    }
  }

  ${TabsContainer} {
    border-left: 0;
    border-radius: 0 4px 4px 0;
  }
`;

export const FlexVertical = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Label = styled.div`
  align-items: center;
  display: flex;
  height: 32px;
`;
