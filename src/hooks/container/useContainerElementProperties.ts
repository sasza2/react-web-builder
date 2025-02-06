import { useBreakpoint } from '../useBreakpoint';
import { useContainerElementPropertiesByValue } from './useContainerElementPropertiesByValue';

export const useContainerElementProperties = (): Record<string, unknown> => {
  const container = useBreakpoint();

  const getProperties = useContainerElementPropertiesByValue();
  return getProperties(container);
};
