import { Page } from 'types';

import { useAppSelector } from '@/store/useAppSelector';
import { getPageSettings } from '@/utils/pageSettings';

import { useBreakpoints } from '../useBreakpoints';
import { useElements } from '../useElements';
import { usePageSettings } from '../usePageSettings';

export const useBuildPage = () => {
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);
  const { elementsExtras } = useElements();
  const pageSettings = usePageSettings();

  const build = (): Page => ({
    ...getPageSettings(pageSettings),
    breakpoints,
    elementsInBreakpoints,
    elementsExtras: elementsExtras.current,
  });

  return build;
};
