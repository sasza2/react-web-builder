import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  .react-tooltip {
    ${({ theme }) => theme.typography.Medium0R};
  }

  .react-panzoom {
    cursor: default;
  }

  .react-panzoom,
  .react-panzoom--element-moving,
  .react-panzoom--grabbing {
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    user-select: none;
  }

  .react-panzoom-element {
    cursor: grab;
  }

  .react-panzoom--element-moving,
  .react-panzoom--element-moving .react-panzoom,
  .react-panzoom--element-moving .react-panzoom-element {
    cursor: grabbing;
  }

  .react-web-builder-box-shadow {
    position: fixed;
    background-color: ${({ theme }) => `${theme.colors.black}cc`};
    z-index: ${({ theme }) => theme.zIndex.helperShadows};
    transition: 0.3s background-color;
  }

  .react-web-builder-box-shadow-animating {
    background-color: ${({ theme }) => `${theme.colors.black}00`};
  }

  .arrow {
    pointer-events: none;
    z-index: ${({ theme }) => theme.zIndex.max};
  }

  .arrow__path {
    stroke: ${({ theme }) => theme.colors.lightGray};
    fill: transparent;
    stroke-width: 4px;
  }

  .arrow__head line {
    stroke: ${({ theme }) => theme.colors.lightGray};
    stroke-width: 4px;
  }

  .react-panzoom--grabbing,
  .react-panzoom--element-moving,
  .react-panzoom--element-resizing {
     .web-builder-sidebar  {
      pointer-events: none;
    }
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg)
    }

    100% {
      transform: rotate(360deg);
    }
  }
`;
