import styled, { css } from "styled-components";

import { NAVBAR_HEIGHT } from "@/consts";

export const Wrapper = styled.div`
  padding: 0 15px;
  display: flex;
  align-items: center;
  width: calc(100% - var(--react-web-builder-sidebar-width));
  left: var(--react-web-builder-sidebar-width);
  position: relative;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  height: ${NAVBAR_HEIGHT}px;
  z-index: 2;
`;

export const Options = styled.div<{ $toLeft?: boolean }>`
  display: flex;
  align-items: center;
  height: 100%;
  gap: 0px 18px;

  ${({ $toLeft }) =>
		$toLeft &&
		css`
    margin-left: auto;
  `};
`;
