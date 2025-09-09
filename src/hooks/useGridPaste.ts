import type { OrganizeElementsOptions } from 'react-grid-panzoom';
import type { Tree, WebBuilderElement } from 'types';

import { useGridAPI } from '@/components/GridAPIProvider';
import { MARGIN_BOTTOM_ON_PASTED_ELEMENT } from '@/consts';
import { useIsMounted } from '@/hooks/useIsMounted';
import { pasteElements } from '@/store/elementsInBreakpointsSlice';
import { useAppDispatch } from '@/store/useAppDispatch';
import { useAppSelector } from '@/store/useAppSelector';
import { createTreeFromBreakpoint } from '@/utils/breakpoint';
import { paste as clipboardPaste } from '@/utils/clipboard';
import { delay } from '@/utils/delay';
import * as gridPaste from '@/utils/gridPaste';

import { useBreakpoint } from './useBreakpoint';
import { useBreakpoints } from './useBreakpoints';
import { useElements } from './useElements';

type WebBuilderElementClipboard = {
  type: 'element',
  element: WebBuilderElement,
  breakpoint: {
    cols: number,
  }
};

type TreeClipboard = {
  type: 'tree',
  elements: WebBuilderElement[],
  breakpoint: {
    cols: number,
  },
  tree: Tree,
};

export const useGridPaste = () => {
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();
  const isMounted = useIsMounted();
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const dispatch = useAppDispatch();
  const { elementsExtras } = useElements();

  const organizeElements = (options?: OrganizeElementsOptions) => {
    if (!isMounted.current) return null;

    return gridAPIRef.current.organizeElements([], options);
  };

  const organizeElementsDelay = async ({
    addGap,
    pastedElements,
  }: {
    addGap?: number,
    pastedElements: WebBuilderElement[],
  }) => {
    await delay(100);
    if (!isMounted.current) return;

    organizeElements();
    await delay(2000);

    if (!isMounted.current) return;

    const marginBottomAtElements: Record<string | number, number> = {};

    if (addGap) {
      pastedElements.forEach((element) => {
        marginBottomAtElements[element.id] = addGap;
      });
    }

    organizeElements({
      marginBottomAtElements,
    });
  };

  const paste = (x: number, y: number) => {
    const obj = clipboardPaste() as { type: string };
    if (!obj) return;

    switch (obj.type) {
      case 'element': {
        const {
          breakpoint: clipboardBreakpoint,
          element,
        } = obj as WebBuilderElementClipboard;

        const pastedElement = gridPaste.pasteElement({
          breakpoint,
          clipboardBreakpoint,
          element,
          x,
          y,
        });

        const elementsTree = createTreeFromBreakpoint({
          allBreakpoints: breakpoints,
          elementsInBreakpoints,
          selectedElements: [pastedElement],
          currentBreakpoint: breakpoint,
          elementsExtras: elementsExtras.current,
          rewriteContainersIds: true,
        });

        dispatch(pasteElements({ currentBreakpoint: breakpoint, elementsTree }));

        organizeElementsDelay({
          pastedElements: [pastedElement],
        });
        break;
      }
      case 'tree': {
        const {
          breakpoint: clipboardBreakpoint,
          elements,
          tree,
        } = obj as TreeClipboard;

        const pastedElements = gridPaste.pasteElements({
          breakpoint,
          clipboardBreakpoint,
          elements,
          tree,
          y,
        });

        const elementsTree = createTreeFromBreakpoint({
          allBreakpoints: breakpoints,
          elementsInBreakpoints,
          selectedElements: pastedElements,
          currentBreakpoint: breakpoint,
          elementsExtras: elementsExtras.current,
          rewriteContainersIds: true,
        });

        dispatch(pasteElements({ currentBreakpoint: breakpoint, elementsTree }));

        organizeElementsDelay({
          addGap: clipboardBreakpoint.cols === breakpoint.cols ? 0 : MARGIN_BOTTOM_ON_PASTED_ELEMENT,
          pastedElements,
        });
        break;
      }
      default:
        throw new Error(`grid paste unexpected type ${obj.type}`);
    }
  };

  return paste;
};
