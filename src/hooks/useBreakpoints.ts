import { useAppSelector } from '@/store/useAppSelector';

export const useBreakpoints = () => {
  const breakpoints = useAppSelector((state) => state.breakpoints);
  return breakpoints;
};
