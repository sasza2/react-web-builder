import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import ReactGrid, { GridAPI, GridElement } from 'react-grid-panzoom';
import { useDispatch } from 'react-redux';

import { Breakpoint, WebBuilderElement, WebBuilderElements } from 'types';
import { calculatePositionsOfElements, getElementsFromTree } from '@/utils/templates';
import getBreakpointWidth from '@/utils/getBreakpointWidth';
import { useProperties } from '@/components/PropertiesProvider';
import { produceRenderForElement } from '@/utils/element';
import { assignAllToElementsExtras, initElementsExtrasFromBreakpoint } from '@/utils/breakpoint';
import { ElementsContext } from '@/components/ElementsProvider';
import { setElementsInBreakpoint } from '@/store/elementsInBreakpointsSlice';
import { delay } from '@/utils/delay';
import { useAppSelector } from '@/store/useAppSelector';
import { RenderInContainer } from '@/components/RenderInContainer';
import { useFontImport } from '@/hooks/useFontImport';
import { usePageSettings } from '@/hooks/usePageSettings';
import { GridDiv } from '../Grid.styled';

type LoadBreakpointProps = {
  breakpoint: Breakpoint,
  onFinishLoading: (breakpoint: Breakpoint) => void,
  onStartLoading: (breakpoint: Breakpoint) => void,
};

export function LoadBreakpoint({
  breakpoint,
  onFinishLoading,
  onStartLoading,
}: LoadBreakpointProps) {
  const { components, page, transformElementProperty } = useProperties();
  const gridTemplateAPIRef = useRef<GridAPI>();
  const { elementsExtras } = useContext(ElementsContext);
  const dispatch = useDispatch();
  const breakpointFromStore = useAppSelector((state) => state.breakpoints.find((item) => item.id === breakpoint.id));
  const pageSettings = usePageSettings();
  const fontImport = useFontImport(pageSettings.fontFamily);

  const [elements, setElements] = useState<WebBuilderElements>(
    () => getElementsFromTree(breakpoint.template),
  );

  useEffect(() => {
    let mounted = true;

    const organizeElements = async () => {
      onStartLoading(breakpoint);

      await delay(2500); // TODO

      if (!mounted) return;

      let nextElements: WebBuilderElements;

      try {
        gridTemplateAPIRef.current.organizeElements();
        nextElements = calculatePositionsOfElements(
          breakpoint.template,
          gridTemplateAPIRef.current.measureElementHeight,
        );
      } catch (e) {
        console.warn('Error while loading breakoint template', breakpoint, e); // eslint-disable-line no-console
        return;
      }

      dispatch(setElementsInBreakpoint({
        elements: nextElements,
        breakpointId: breakpoint.id,
      }));

      setElements(nextElements);

      await delay(500); // TODO

      if (!mounted) return;

      initElementsExtrasFromBreakpoint(page, breakpointFromStore, elementsExtras);
      assignAllToElementsExtras(elementsExtras, breakpointFromStore, gridTemplateAPIRef);

      onFinishLoading(breakpoint);
    };

    organizeElements();

    return () => {
      mounted = false;
    };
  }, []);

  const setGridElements = (gridElements: GridElement[]) => {
    const nextElements = gridElements.map((element) => {
      const nextElement = { ...element };
      delete nextElement.render;
      return nextElement as unknown as WebBuilderElement;
    });

    dispatch(setElementsInBreakpoint({
      elements: nextElements,
      breakpointId: breakpoint.id,
    }));

    setElements(nextElements);
  };

  const gridElements = useMemo(
    () => elements.map((element) => {
      const [render] = produceRenderForElement(
        components,
        breakpoint,
        element,
        transformElementProperty,
      );

      return {
        ...element,
        fullHeight: true,
        render,
      } as unknown as GridElement;
    }),
    [components, elements],
  );

  return (
    <GridDiv
      $breakpoint={breakpoint}
      $fontImport={fontImport}
      $height="100vh"
      $isLoaded
      $pageSettings={pageSettings}
    >
      <RenderInContainer breakpoint={breakpointFromStore}>
        <ReactGrid
          autoOrganizeElements
          boundary
          cols={breakpoint.cols}
          rowHeight={breakpoint.rowHeight}
          rows="auto"
          elements={gridElements}
          setElements={setGridElements}
          width={getBreakpointWidth(breakpoint)}
          ref={gridTemplateAPIRef}
        />
        {fontImport?.stylesheet}
      </RenderInContainer>
    </GridDiv>
  );
}
