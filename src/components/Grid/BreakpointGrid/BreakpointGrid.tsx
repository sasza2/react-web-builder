import React from 'react';
import ReactGrid, {
  defaultOrganizeGridElements, organizeGridElementsWithBringUp,
} from 'react-grid-panzoom';

import { NAVBAR_HEIGHT } from '@/consts';
import { assignTestProp } from '@/utils/tests';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useBlurSelectedElement } from '@/hooks/useBlurSelectedElement';
import { useDeleteElementOnKey } from '@/hooks/useDeleteElementOnKey';
import { useFontImport } from '@/hooks/useFontImport';
import { useGetBreakpointWidth } from '@/hooks/useGetBreakpointWidth';
import { useGridPaste } from '@/hooks/useGridPaste';
import { useSetGridElements } from '@/hooks/useSetGridElements';
import { useSetElementsHeight } from '@/hooks/useSetElementsHeight';
import { usePageSettings } from '@/hooks/usePageSettings';
import { useWebBuilderSizeHeight } from '@/components/WebBuilderSize';
import { useSelectedElements } from '@/hooks/useSelectedElements';
import { useElementOnStartResizing } from '@/hooks/useElementOnStartResizing';
import { useConfiguration } from '../../ConfigurationProvider';
import { useGridAPI } from '../../GridAPIProvider/GridAPIProvider';
import { RenderInContainer } from '../../RenderInContainer';
import { DotBackground } from '../DotBackground';
import useOnElementClick from '../useOnElementClick';
import useCenterGridOnInit from '../useCenterGridOnInit';
import useElementsWithRender from '../useElementsWithRender';
import useGridMovement from '../useGridMovement';
import useIsGridLoaded from '../useIsGridLoaded';
import { useOnContextMenu } from '../useOnContextMenu';
import { useScroll } from '../useScroll';
import { GridDiv } from '../Grid.styled';
import { Popup } from '../Popup';
import { ContainerBackground } from '../ContainerBackground';

const ZOOM_CENTER_POSITION = { x: 'center' } as const;

export function BreakpointGrid() {
  const gridAPIRef = useGridAPI();
  const breakpoint = useBreakpoint();
  const configuration = useConfiguration();
  const isLoaded = useIsGridLoaded();
  const setGridElements = useSetGridElements();
  const pageSettings = usePageSettings();
  const webBuilderHeight = useWebBuilderSizeHeight() - NAVBAR_HEIGHT;
  const onElementClick = useOnElementClick();
  const elements = useElementsWithRender();
  const movement = useGridMovement();
  const setElementsHeight = useSetElementsHeight();
  useCenterGridOnInit(isLoaded);
  const contextMenu = useOnContextMenu();
  const { scrollElement, onScrollChange } = useScroll();
  const gridPaste = useGridPaste();
  const fontImport = useFontImport(pageSettings.fontFamily);
  const { selectedElements } = useSelectedElements();
  useDeleteElementOnKey();
  useBlurSelectedElement();
  const organizeGridElements = configuration.bringElementsAbove
    ? organizeGridElementsWithBringUp
    : defaultOrganizeGridElements;
  const onElementStartResizing = useElementOnStartResizing();
  const getBreakpointWidth = useGetBreakpointWidth();

  const grid = (
    <ReactGrid
      autoOrganizeElements
      boundary
      cols={breakpoint.cols}
      rowHeight={breakpoint.rowHeight}
      rows="auto"
      elements={elements}
      elementResizerWidth={30}
      helpLines={configuration.helpLines}
      setElements={setGridElements}
      onContainerChange={onScrollChange}
      onContainerContextMenu={contextMenu.onContainerContextMenu}
      onElementClick={onElementClick}
      onElementContextMenu={contextMenu.onElementContextMenu}
      onElementsMeasureUpdate={setElementsHeight}
      onElementStartResizing={onElementStartResizing}
      organizeGridElements={organizeGridElements}
      width={getBreakpointWidth(breakpoint)}
      {...movement}
      ref={gridAPIRef}
      scrollSpeed={(configuration.scrollSpeed + 1) * 10}
      zoomPosition={configuration.gridZoomingInCenter ? ZOOM_CENTER_POSITION : null}
    >
      {isLoaded && <ContainerBackground />}
      <DotBackground />
    </ReactGrid>
  );

  return (
    <GridDiv
      $breakpoint={breakpoint}
      $fontImport={fontImport}
      $height={webBuilderHeight}
      $isLoaded={isLoaded}
      $selectedElements={selectedElements}
      {...assignTestProp('grid')}
    >
      <RenderInContainer breakpoint={breakpoint}>
        {grid}
      </RenderInContainer>
      {scrollElement}
      {contextMenu.menu && <Popup {...contextMenu} gridPaste={gridPaste} />}
      {fontImport?.stylesheet}
    </GridDiv>
  );
}
