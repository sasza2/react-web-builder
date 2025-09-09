import styled from "styled-components";

import { FormControlDiv } from "@/components/forms/FormControl.styled";

export const InputContainer = styled.div`
  display: flex;
  gap: 8px;

  ${FormControlDiv} {
    width: calc(100% - 40px);
  }
`;

export const OptionContainer = styled.div`
  display: flex;
  gap: 8px;
`;

export const ColorsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export const AddIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 50%;
  cursor: pointer;

  svg {
    width: 14px;
    height: 14px;
    transform: rotate(45deg);
  }
`;
