import { OrganizeElementsOptions } from 'react-grid-panzoom';

import { Tree, WebBuilderElement } from 'types';
import { MARGIN_BOTTOM_ON_PASTED_ELEMENT } from '@/consts';
import { paste as clipboardPaste } from '@/utils/clipboard';
import { delay } from '@/utils/delay';
import { useAddElement } from '@/hooks/useAddElement';
import { useIsMounted } from '@/hooks/useIsMounted';
import { pasteElement, pasteElements } from '@/utils/gridPaste';
import { useGridAPI } from '@/components/GridAPIProvider';
import { useBreakpoint } from './useBreakpoint';
import { useAddElements } from './useAddElements';

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
  const addElement = useAddElement();
  const addElements = useAddElements();
  const breakpoint = useBreakpoint();
  const gridAPIRef = useGridAPI();
  const isMounted = useIsMounted();

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

        const pastedElement = pasteElement({
          breakpoint,
          clipboardBreakpoint,
          element,
          x,
          y,
        });

        addElement(pastedElement);

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

        const pastedElements = pasteElements({
          breakpoint,
          clipboardBreakpoint,
          elements,
          tree,
          y,
        });

        addElements(pastedElements);

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
