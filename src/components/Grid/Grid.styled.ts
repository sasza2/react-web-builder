import styled, { css } from 'styled-components';

import { Breakpoint, FontImport } from 'types';
import { SIDEBAR_WIDTH } from '@/consts';
import { getBreakpointPadding } from '@/utils/breakpoint';
import { Theme } from '../StyleProvider/styled';

type GridDivProps = {
  $breakpoint: Breakpoint,
  $fontImport: FontImport | null;
  $height: string | number,
  $isLoaded: boolean,
  $selectedElementId?: string,
  $selectedElements?: (string | number)[],
};

const getBoxShadow = (breakpoint: Breakpoint, theme: Theme): string => {
  const padding = getBreakpointPadding(breakpoint);
  return `${theme.colors.lightGray} -${padding.left}px 0px 0px 0px, ${theme.colors.lightGray} ${padding.right}px 0px 0px 0px`;
};

export const GridDiv = styled.div<GridDivProps>`
  display: flex;
  position: relative;
  justify-content: center;
  width: ${() => `calc(100% - ${SIDEBAR_WIDTH}px)`};
  max-width: ${() => `calc(100% - ${SIDEBAR_WIDTH}px)`};
  margin-left: ${() => `${SIDEBAR_WIDTH}px`};
  transition: opacity 0.6s;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.lightGray};
  border-top: none;
  background-color: ${({ theme }) => theme.colors.white};
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  max-height: ${({ $height }) => `${$height}px`};
  opacity: ${({ $isLoaded }) => ($isLoaded ? '1' : '0')};

  .react-grid-panzoom {
    width: ${'calc(100% - 30px)'};
    height: ${({ $height }) => `${$height}px`};
    max-height: ${({ $height }) => `${$height}px`};

    .react-panzoom {
      .react-panzoom__in {
        font-family: ${({ $fontImport }) => $fontImport?.fontFamily};
        background-color: ${({ $breakpoint }) => $breakpoint.backgroundColor};
        box-shadow: ${({ $breakpoint, theme }) => getBoxShadow($breakpoint, theme)};

        ${({ $selectedElementId }) => ($selectedElementId
    ? `
                    .react-panzoom-element--id-${$selectedElementId} {
                      outline-offset: -2px;
                      animation: react-panzoom-element-animation 1s infinite;
                    }
                    `
    : undefined)
}
      }
    }

    ${({ $selectedElements, theme }) => $selectedElements && css`
      ${$selectedElements.map((elementId) => (
    `
          .react-panzoom-element--id-${elementId} {
            transition: 0s !important;

            .react-grid-panzoom-element-selection {
              outline: 4px solid ${theme.colors.darkBlue}50 !important;
              background-color: ${theme.colors.darkBlue}25;
            }
          }
        `
  ))}
    `}

    .react-grid-panzoom-lines-container .react-grid-panzoom-line {
      background-color: ${({ theme }) => theme.colors.gray};
      color: ${({ theme }) => theme.colors.gray};
    }
  }
`;
