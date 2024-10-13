import { TFunction } from 'i18next';

import {
  Breakpoint, ElementsExtras, Tree, WebBuilderElements,
} from 'types';
import { getElementPaddingFromStyle, getElementsReference } from '@/components/View/elementsRefMap';
import { DEFAULT_CONTAINER_ID } from '@/consts';
import { cloneTree } from '@/components/View/cloneTree';
import { calculatePositionsOfElements } from './templates';
import { createUniqueId } from './createUniqueId';

export const getContainerExtras = (container: Breakpoint, zoom: number): ElementsExtras => {
  const containerExtras: ElementsExtras = {};
  const containerMapRef = getElementsReference(container);
  if (!containerMapRef) return null;

  containerMapRef.forEach((elementRef, elementId) => {
    const paddingBottom = getElementPaddingFromStyle(DEFAULT_CONTAINER_ID, elementId) || 0;
    const heightInPixels = (elementRef.firstChild as HTMLElement).getBoundingClientRect().height;

    containerExtras[elementId] = {
      height: Math.ceil(Math.round(heightInPixels / container.rowHeight / zoom * 10) / 10),
      paddingBottom,
    };
  });

  return containerExtras;
};

export const getDefaultContainer = (parent: Breakpoint): Breakpoint => ({
  id: DEFAULT_CONTAINER_ID,
  cols: parent.cols,
  from: parent.from,
  rowHeight: parent.rowHeight,
  padding: {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
  },
  parentId: parent.id,
  to: null,
});

export const createTreeForContainer = (cols: number, t: TFunction<'common'>): Tree => {
  const tree: Tree = {
    id: 'predefined-row-1',
    h: 0,
    marginBottom: 0,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    type: 'row',
    w: cols,
    children: [
      {
        id: 'predefined-container-box-1',
        h: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 0,
        w: cols,
        type: 'component',
        element: {
          id: 'predefined-container-box-1',
          componentName: 'Box',
          props: [
            {
              propId: 'content',
              value: [
                {
                  align: 'center',
                  type: 'paragraph',
                  children: [
                    {
                      bold: true,
                      fontSize: 16,
                      color: '#000000',
                      text: t('container.defaultElements.info1'),
                    },
                  ],
                },
              ],
            },
          ],
          h: 'auto',
          x: 0,
          y: 0,
          w: cols,
        },
      },
      {
        id: 'predefined-container-custom-button-1',
        h: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 2,
        w: cols,
        type: 'component',
        element: {
          id: 'predefined-container-custom-button-1',
          componentName: 'CustomButton',
          props: [],
          h: 'auto',
          x: 0,
          y: 0,
          w: cols,
        },
      },
      {
        id: 'predefined-container-box-2',
        h: 0,
        marginBottom: 0,
        marginLeft: 0,
        marginRight: 0,
        marginTop: 2,
        w: cols,
        type: 'component',
        element: {
          id: 'predefined-container-box-2',
          componentName: 'Box',
          props: [
            {
              propId: 'content',
              value: [
                {
                  align: 'center',
                  type: 'paragraph',
                  children: [
                    {
                      color: '#000000',
                      text: t('container.defaultElements.info2'),
                    },
                  ],
                },
              ],
            },
          ],
          h: 'auto',
          x: 0,
          y: 0,
          w: cols,
        },
      },
    ],
  };

  return tree;
};

export const createElementsForContainer = (
  container: Breakpoint,
  parent: Breakpoint,
  t: TFunction<'common'>,
): {
    elements: WebBuilderElements,
    getPaddingBottom: (elementId: string) => number,
    measureContainerElement: (elementId: string) => number,
  } => {
  const mappedElementsIds: Record<string, string> = {};

  const clonedTree = cloneTree(createTreeForContainer(container.cols, t), (originalId) => {
    const elementId = createUniqueId();

    mappedElementsIds[elementId] = originalId;

    return elementId;
  });

  const containerExtras = getContainerExtras(getDefaultContainer(parent), 1);

  const measureContainerElement = (elementId: string) => {
    const originalId = mappedElementsIds[elementId];

    return containerExtras[originalId].height;
  };

  const getPaddingBottom = (elementId: string): number => {
    const originalId = mappedElementsIds[elementId];

    const paddingBottom = getElementPaddingFromStyle(DEFAULT_CONTAINER_ID, originalId) || 0;

    return paddingBottom;
  };

  const elements = calculatePositionsOfElements(clonedTree, measureContainerElement);

  elements.forEach((element) => {
    element.breakpointId = container.id;
  });

  return {
    elements,
    getPaddingBottom,
    measureContainerElement,
  };
};
