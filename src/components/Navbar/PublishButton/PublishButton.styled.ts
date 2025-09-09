import styled, { css } from "styled-components";

export const AbsoluteContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50px;
  right: 0px;
  pointer-events: ${({ $isOpen }) => ($isOpen ? "all" : "none")};
`;

export const Popup = styled.div<{ $isOpen: boolean; $isClosing: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 10px;
  gap: 10px;
  width: 230px;
  background-color: ${({ theme }) => theme.colors.white};
  box-shadow: 0px 1px 2px 1px ${({ theme }) => `${theme.colors.black}0D`};
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  pointer-events: none;
  opacity: ${({ $isOpen, $isClosing }) => {
		if ($isClosing || !$isOpen) return "0";
		return "1";
	}};
  transition: opacity 0.3s;
  ${({ theme }) => theme.typography.Big0R};
  visibility: ${({ $isOpen, $isClosing }) => {
		if ($isClosing || $isOpen) return "visibile";
		return "hidden";
	}};

  ${({ $isOpen }) =>
		$isOpen &&
		css`
    pointer-events: all;
  `}
`;

export const PopupItem = styled.div`
  padding: 6px 12px;
  &:hover {
    background-color: ${({ theme }) => theme.colors.whiteSmoke};
    cursor: pointer;
  }
  color: ${({ theme }) => theme.colors.black};
`;

export const Wrapper = styled.div`
  position: relative;
  svg {
    margin-left: 8px;
    width: 12px;
    height: 12px;
    fill: ${({ theme }) => theme.colors.white};
    transform: rotate(270deg);
  }
`;
