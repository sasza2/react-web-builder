import { useEffect } from 'react';
import { BreakpointId, Position } from 'types';

import { useGridAPI } from '@/components/GridAPIProvider';
import { useWebBuilderSizeWidth } from '@/components/WebBuilderSize';
import { useBreakpoint } from '@/hooks/useBreakpoint';
import { useGetBreakpointWidth } from '@/hooks/useGetBreakpointWidth';
import { getBreakpointPadding } from '@/utils/breakpoint';
import getGridCenterPositionX from '@/utils/getGridCenterPositionX';

import { useSidebarWidth } from '../SidebarProvider';
import { GRID_PADDING_WIDTH } from './Grid.styled';

const DESKTOP_ZOOM_SCALE = 0.9;
const MOBILE_BREAKPOINT_WIDTH = 720; // px
const MOBILE_ZOOM_SCALE = 0.7;

const breakpointsLastPosition = new Map<BreakpointId, { position: Position, zoom: number }>();

export const useGridPositionInit = (isLoaded: boolean) => {
  const gridAPIRef = useGridAPI();
  const breakpoint = useBreakpoint();
  const sidebarWidth = useSidebarWidth();
  const webBuilderWidth = useWebBuilderSizeWidth() - sidebarWidth - GRID_PADDING_WIDTH;
  const getBreakpointWidth = useGetBreakpointWidth();

  useEffect(() => {
    if (!isLoaded) return;

    const panZoom = gridAPIRef.current.getPanZoom();
    if (!panZoom) return;

    const savePosition = () => {
      breakpointsLastPosition.set(breakpoint.id, {
        position: panZoom.getPosition(),
        zoom: panZoom.getZoom(),
      });
    };

    const lastBreakpointPosition = breakpointsLastPosition.get(breakpoint.id);
    if (lastBreakpointPosition) {
      panZoom.setZoom(lastBreakpointPosition.zoom);
      panZoom.setPosition(lastBreakpointPosition.position.x, lastBreakpointPosition.position.y);

      return savePosition;
    }

    const padding = getBreakpointPadding(breakpoint);
    const breakpointWidth = getBreakpointWidth(breakpoint) + padding.left + padding.right;
    if (webBuilderWidth < breakpointWidth) {
      panZoom.setZoom(webBuilderWidth / breakpointWidth * DESKTOP_ZOOM_SCALE);
    } else if (breakpointWidth < MOBILE_BREAKPOINT_WIDTH) {
      panZoom.setZoom(MOBILE_ZOOM_SCALE);
    }

    panZoom.setPosition(
      getGridCenterPositionX(breakpointWidth - padding.left - padding.right, webBuilderWidth, panZoom.getZoom()),
      0,
    );

    return savePosition;
  }, [isLoaded, webBuilderWidth]);
};
