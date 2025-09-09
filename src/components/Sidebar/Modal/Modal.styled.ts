import styled from "styled-components";

import { NAVBAR_HEIGHT, SIDEBAR_WIDTH } from "@/consts";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  gap: 16px;
  position: absolute;
  background-color: transparent;
  pointer-events: none;
  max-height: 320px;
  left: ${`${SIDEBAR_WIDTH + 16}px`};
  top: ${`${NAVBAR_HEIGHT + 16}px`};
  z-index: ${({ theme }) => theme.zIndex.max};

  >div {
    width: ${SIDEBAR_WIDTH}px;
  }
`;
