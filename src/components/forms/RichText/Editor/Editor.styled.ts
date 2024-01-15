import styled from 'styled-components';

export const SLATE_HIGHLIGHTED = 'react-web-builder-editor-higlighted';

export const EditableWrapper = styled.div`
  height: 160px;
  max-height: 160px;

  div[role="textbox"] {
    min-height: 140px;
    outline: none;
  }

  .react-web-builder-editor-higlighted {
    text-shadow: ${({ theme }) => `1px 1px 2px ${theme.colors.black}, 0 0 1em ${theme.colors.black}, 0 0 0.2em ${theme.colors.lightGray}`};
  }
`;

export const EditableIn = styled.div`
  margin: 5px;
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
