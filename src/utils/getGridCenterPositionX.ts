const getGridCenterPositionX = (breakpointWidth: number, webBuilderWidth: number, zoom: number) => {
  const panZoomChildWidth = breakpointWidth * zoom;

  if (panZoomChildWidth >= webBuilderWidth) return 0;

  return (webBuilderWidth - panZoomChildWidth) / 2;
};

export default getGridCenterPositionX;
