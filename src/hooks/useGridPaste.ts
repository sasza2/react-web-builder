import { Tree, WebBuilderElement } from 'types';
import { paste as clipboardPaste } from '@/utils/clipboard';
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

  const organizeElements = () => {
    if (!isMounted.current) return;

    gridAPIRef.current.organizeElements();
  };

  const organizeElementsDelay = () => {
    setTimeout(organizeElements, 100);
    setTimeout(organizeElements, 2000);
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

        addElement(pasteElement({
          breakpoint,
          clipboardBreakpoint,
          element,
          x,
          y,
        }));

        organizeElementsDelay();
        break;
      }
      case 'tree': {
        const {
          breakpoint: clipboardBreakpoint,
          elements,
          tree,
        } = obj as TreeClipboard;

        addElements(pasteElements({
          breakpoint,
          clipboardBreakpoint,
          elements,
          tree,
          y,
        }));

        organizeElementsDelay();
        break;
      }
      default:
        throw new Error(`grid paste unexpected type ${obj.type}`);
    }
  };

  return paste;
};
