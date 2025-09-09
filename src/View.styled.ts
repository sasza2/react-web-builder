import { createGlobalStyle } from "styled-components";

export const HIDE_SCROLLBAR_CLASS_NAME = "react-web-builder-hide-scrollbar";

export const ViewGlobalStyles = createGlobalStyle`
  ${`.${HIDE_SCROLLBAR_CLASS_NAME}`}::-webkit-scrollbar {
    display: none;
  }

  ${`.${HIDE_SCROLLBAR_CLASS_NAME}`} {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;
