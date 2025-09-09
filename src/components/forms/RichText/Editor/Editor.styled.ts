import styled from "styled-components";

import { RESIZABLE_PROP_NAME } from "@/components/Resizable";

export const SLATE_HIGHLIGHTED = "react-web-builder-editor-higlighted";

export const EditableWrapper = styled.div`
  height: ${() => `calc(var(${RESIZABLE_PROP_NAME}, 160px) - 10px)`};
  max-height: ${() => `calc(var(${RESIZABLE_PROP_NAME}, 160px) - 10px)`};

  div[role="textbox"] {
    min-height: 140px;
    height: calc(100% - 20px);
    outline: none;
  }

  .react-web-builder-editor-higlighted {
    text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.black}, 0 0 1em ${theme.colors.black}, 0 0 0.2em ${theme.colors.lightGray}`};
  }
`;

export const EditableIn = styled.div`
  margin: 5px;
  height: calc(100% - 10px);
`;

export const EditableMargin = styled.div`
  min-height: 10px;
  max-height: 10px;
`;

export const ScrollbarIn = styled.div``;

export const IFrameWrapper = styled.div`
  iframe {
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colors.lightGray};
    transition: opacity 0.2s;
  }
`;
