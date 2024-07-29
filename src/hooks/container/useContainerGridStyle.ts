import { useContainerStyle, ContainerStyleProps } from '@/components/ElementContainer/useContainerStyle';
import { useAppSelector } from '@/store/useAppSelector';
import { useContainerElementProperties } from './useContainerElementProperties';
import { useBreakpoint } from '../useBreakpoint';
import { useBreakpoints } from '../useBreakpoints';

export const useContainerGridStyle = () => {
  const breakpoint = useBreakpoint();
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const properties = useContainerElementProperties(breakpoint, breakpoints, elementsInBreakpoints);

  const style = useContainerStyle(properties as ContainerStyleProps);

  return style;
};
