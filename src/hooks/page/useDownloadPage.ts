import { Page, WebBuilderElements, WebBuilderProps } from 'types';

import { useWebBuilderProperties } from '@/components/PropertiesProvider';
import { useAppSelector } from '@/store/useAppSelector';
import { getPageSettings } from '@/utils/pageSettings';

import { useBreakpoints } from '../useBreakpoints';
import { usePageSettings } from '../usePageSettings';
import { useBuildBreakpointWithTree } from './useBuildBreakpointWithTree';

const downloadBlob = (page: Page, onBeforeDownloadPage?: WebBuilderProps['onBeforeDownloadPage']) => {
  let transformedPage = page;
  let filename = 'builder.json';

  if (onBeforeDownloadPage) {
    const result = onBeforeDownloadPage(transformedPage);
    if (result && typeof result === 'object') {
      if (result.filename) filename = result.filename;
      if (result.page) transformedPage = result.page;
    }
  }

  const blob = new Blob([JSON.stringify(transformedPage)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
};

export const useDownloadPage = () => {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const pageSettings = usePageSettings();
  const buildBreakpointWithTree = useBuildBreakpointWithTree();
  const { onBeforeDownloadPage } = useWebBuilderProperties();

  const download = () => {
    const elements: WebBuilderElements = [];
    Object.entries(elementsInBreakpoints).forEach(([breakpointId, elementsInBreakpoint]) => {
      elementsInBreakpoint.forEach((element) => {
        elements.push({
          ...element,
          breakpointId,
        });
      });
    });

    const breakpointsWithTree = breakpoints.map(buildBreakpointWithTree).filter((breakpoint) => breakpoint.view).map((breakpoint) => ({
      ...breakpoint,
      view: null,
      template: breakpoint.view,
    }));

    downloadBlob({
      ...getPageSettings(pageSettings),
      breakpoints: breakpointsWithTree,
    } as Page, onBeforeDownloadPage);
  };

  return download;
};
