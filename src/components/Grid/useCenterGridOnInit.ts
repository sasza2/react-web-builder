import { useEffect } from 'react';

import { SIDEBAR_WIDTH } from '@/consts';
import { useGridAPI } from '@/components/GridAPIProvider';
import getGridCenterPositionX from '@/utils/getGridCenterPositionX';
import { useWebBuilderSizeWidth } from '@/components/WebBuilderSize';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useGetBreakpointWidth } from '@/hooks/useGetBreakpointWidth';

const useCenterGridOnInit = (isLoaded: boolean) => {
  const gridAPIRef = useGridAPI();
  const breakpoint = useBreakpoint();
  const webBuilderWidth = useWebBuilderSizeWidth() - SIDEBAR_WIDTH - 60; // TODO
  const getBreakpointWidth = useGetBreakpointWidth();

  useEffect(() => {
    if (!isLoaded) return;

    const panZoom = gridAPIRef.current.getPanZoom();
    if (!panZoom) return;

    const breakpointWidth = getBreakpointWidth(breakpoint);
    if (webBuilderWidth < breakpointWidth) {
      panZoom.setZoom(webBuilderWidth / breakpointWidth);
    }

    panZoom.setPosition(
      getGridCenterPositionX(breakpointWidth, webBuilderWidth, 1) + 15,
      0,
    ); // TODO
  }, [isLoaded, webBuilderWidth]);
};

export default useCenterGridOnInit;
