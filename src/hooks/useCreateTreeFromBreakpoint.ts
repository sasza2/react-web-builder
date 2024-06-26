import { WebBuilderElement } from 'types';
import { useAppSelector } from '@/store/useAppSelector';
import { createTreeFromBreakpoint } from '@/utils/breakpoint';
import { useBreakpoints } from './useBreakpoints';
import { useElements } from './useElements';
import { useBreakpoint } from './useBreakpoint';

export const useCreateTreeFromBreakpoint = () => {
  const breakpoint = useBreakpoint();
  const breakpoints = useBreakpoints();
  const { elementsExtras } = useElements();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const create = (selectedElements: WebBuilderElement[], rewriteContainersIds: boolean) => createTreeFromBreakpoint({
    allBreakpoints: breakpoints,
    elementsInBreakpoints,
    selectedElements,
    currentBreakpoint: breakpoint,
    elementsExtras: elementsExtras.current,
    rewriteContainersIds,
  });

  return create;
};
