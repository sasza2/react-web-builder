import styled from "styled-components";

import { FormControlDiv } from "../../FormControl.styled";

export const Popup = styled.div<{ $closing: boolean }>`
  margin-top: -70px;
  margin-left: -3px;
  padding: 5px;
  z-index: 2;
  position: absolute;
  background-color: ${({ theme }) => theme.colors.white};
  width: 230px;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  opacity: ${({ $closing }) => ($closing ? "0" : "1")};
  transition: opacity 0.3s;

  ${FormControlDiv} {
    z-index: 2;
  }
`;

export const Arrow = styled.div`
  position: absolute;
  left: 7px;
  top: 59px;
  height: 15px;
  width: 15px;
  border-right: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-bottom: 1px solid ${({ theme }) => theme.colors.lightGray};
  transform: rotate(45deg);
  z-index: 1;
  overflow: hidden;
`;

export const ArrowIn = styled.div`
  margin-top: 4px;
  margin-left: 4px;
  height: 20px;
  width: 20px;
  opacity: 1;
  background-color: ${({ theme }) => theme.colors.white};
  transform: rotate(45deg);
`;
