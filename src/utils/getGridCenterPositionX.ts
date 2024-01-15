import { Breakpoint } from 'types';

import getBreakpointWidth from './getBreakpointWidth';

const getGridCenterPositionX = (breakpoint: Breakpoint, webBuilderWidth: number, zoom: number) => {
  const panZoomChildWidth = getBreakpointWidth(breakpoint) * zoom;

  if (panZoomChildWidth >= webBuilderWidth) return 0;

  return (webBuilderWidth - panZoomChildWidth) / 2;
};

export default getGridCenterPositionX;
