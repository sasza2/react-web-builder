import { Breakpoint } from 'types';
import { useAppSelector } from '@/store/useAppSelector';

type UseBreakpoint = () => Breakpoint | null;

export const useBreakpoint: UseBreakpoint = () => {
  const breakpoint = useAppSelector((state) => {
    const selectedBreakpoint = state.breakpoints.find(
      (currentBreakpoint) => currentBreakpoint.id === state.selectedBreakpoint,
    );
    return selectedBreakpoint || null;
  });
  return breakpoint;
};
