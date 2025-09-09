import styled from "styled-components";

import { ButtonContainer } from "@/components/Button/Button.styled";
import { FlexHorizontal } from "@/components/styles/common";

export const ButtonsActions = styled(FlexHorizontal)`
  ${ButtonContainer} {
    flex-grow: 1;
    width: 100%;
  }
`;
