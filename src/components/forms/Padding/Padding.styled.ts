import styled from "styled-components";

import { FormControlDiv } from "../FormControl.styled";

export const PaddingContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  ${FormControlDiv} {
    width: calc(50% - 8px);

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;
