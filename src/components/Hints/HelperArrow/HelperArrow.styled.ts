import styled from "styled-components";

export const Title = styled.div<{ $animating: boolean }>`
  display: flex;
  align-items: center;
  flex-direction: column;
  position: fixed;
  top: auto;
  right: 0;
  left: 0;
  bottom: 5%;
  z-index: ${({ theme }) => theme.zIndex.max};
  pointer-events: none;
  opacity: ${({ $animating }) => ($animating ? "0" : "1")};
  transition: 0.3s opacity;

  p {
    margin: 0px;
    padding: 5px;
    max-width: 40%;
    text-align: center;
    color: ${({ theme }) => theme.colors.white};
    ${({ theme }) => theme.typography.Big1R};
  }

  div {
    pointer-events: all;
  }
`;

export const ButtonContainer = styled.div`
  margin-top: 10px;
`;

export const boxShadowClassName = "react-web-builder-box-shadow";
export const boxShadowAnimatingIdClassName =
	"react-web-builder-box-shadow-animating";
