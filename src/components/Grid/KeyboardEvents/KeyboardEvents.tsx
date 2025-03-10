import { useEffect, useRef } from 'react';
import { Position, WebBuilderElement, WebBuilderElements } from 'types';

import { useGridAPI } from '@/components/GridAPIProvider';
import { useWebBuilderSizeWidth } from '@/components/WebBuilderSize';
import { SIDEBAR_WIDTH } from '@/consts';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useElements } from '@/hooks/useElements';
import { useGetBreakpointWidth } from '@/hooks/useGetBreakpointWidth';
import { getBreakpointPadding } from '@/utils/breakpoint';
import { sortElements } from '@/utils/element';
import getGridCenterPositionX from '@/utils/getGridCenterPositionX';

import { GRID_PADDING_WIDTH } from '../Grid.styled';

const STEP_SIZE = 20; // px

const KEYS = {
  ArrowUp: {
    x: 0,
    y: STEP_SIZE,
  },
  ArrowDown: {
    x: 0,
    y: -STEP_SIZE,
  },
  ArrowLeft: {
    x: STEP_SIZE,
    y: 0,
  },
  ArrowRight: {
    x: -STEP_SIZE,
    y: 0,
  },
  Tab: {
    x: 0,
    y: 0,
  },
} as const;

type GetNextElement = (props: {
  elements: WebBuilderElements,
  isReversed: boolean,
  lastFocusPosition: Position | null,
}) => WebBuilderElement;

const getNextElement: GetNextElement = ({ elements, isReversed, lastFocusPosition }): WebBuilderElement => {
  const sortedElements = sortElements(elements);

  if (isReversed) sortedElements.reverse();

  if (lastFocusPosition === null) {
    return sortedElements[0];
  }

  const predicateElement = (element: WebBuilderElement) => {
    if (element.y === lastFocusPosition.y && element.x > lastFocusPosition.x) return true;

    return element.y > lastFocusPosition.y;
  };

  const predicateElementReversed = (element: WebBuilderElement) => {
    if (element.y === lastFocusPosition.y && element.x < lastFocusPosition.x) return true;

    return element.y < lastFocusPosition.y;
  };

  let nextElement = sortedElements.find(isReversed ? predicateElementReversed : predicateElement);

  if (!nextElement) {
    [nextElement] = sortedElements;
  }

  return nextElement;
};

export function KeyboardEvents(): JSX.Element {
  const gridAPIRef = useGridAPI();
  const breakpoint = useBreakpoint();
  const { elements } = useElements();
  const elementsRef = useRef<typeof elements>();
  elementsRef.current = elements;
  const webBuilderWidth = useWebBuilderSizeWidth() - SIDEBAR_WIDTH - GRID_PADDING_WIDTH;
  const getBreakpointWidth = useGetBreakpointWidth();

  useEffect(() => {
    let lastFocusPosition: Position | null = null;

    const onKeyDown = (e: KeyboardEvent) => {
      if (document.body !== document.activeElement) return;
      if (!(e.code in KEYS)) return;

      e.preventDefault();
      e.stopPropagation();

      const panZoom = gridAPIRef.current.getPanZoom();
      const panZoomPosition = panZoom.getPosition();

      const addPosition = KEYS[e.code as keyof typeof KEYS];
      if (addPosition.x || addPosition.y) {
        panZoom.setPosition(
          panZoomPosition.x + addPosition.x,
          panZoomPosition.y + addPosition.y,
        );
      }

      if (e.code === 'Tab') {
        if (!elementsRef.current || !elementsRef.current.length) return;

        const nextElement = getNextElement({
          elements: elementsRef.current,
          isReversed: e.shiftKey,
          lastFocusPosition,
        });

        lastFocusPosition = nextElement;

        const panZoomElements = panZoom.getElements();
        const zoom = panZoom.getZoom();
        const panZoomElement = panZoomElements[nextElement.id];

        const padding = getBreakpointPadding(breakpoint);
        const breakpointWidth = getBreakpointWidth(breakpoint);
        panZoom.setPosition(
          getGridCenterPositionX(
            breakpointWidth - padding.left - padding.right,
            webBuilderWidth,
            panZoom.getZoom(),
          ) - (panZoomElement.position.x) * zoom,
          -(panZoomElement.position.y) * zoom,
        );
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return null;
}
