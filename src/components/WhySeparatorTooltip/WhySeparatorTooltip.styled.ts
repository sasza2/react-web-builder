import styled from "styled-components";

export const AnimationContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0px;
  top: 0px;
  right: 0px;
  bottom: 0px;
  background-color: ${({ theme }) => theme.colors.white};
  z-index: ${({ theme }) => theme.zIndex.whySeparatorAnimation};
`;

export const TooltipInline = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 19px;
  height: 19px;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 50%;
  opacity: 0.6;
  transition: opacity 0.3s;
  position: absolute;

  &:hover {
    opacity: 1.0;
    cursor: pointer;
    border: 1px solid ${({ theme }) => theme.colors.darkBlue};

    svg {
      fill: ${({ theme }) => theme.colors.darkBlue};
    }
  }

  svg {
    width: 11px;
  }
`;

export const TooltipPopup = styled.div`
  width: 200px;
`;
