import { useMemo } from 'react';

import { WebBuilderElement } from 'types';
import { byBreakpointId } from '@/utils/breakpoint';
import { getElementContainerIdProp, getProperties } from '@/utils/element';
import { useProperties } from '@/components/PropertiesProvider';
import { useComponentsProperty } from '@/components/ComponentsProvider';
import { useAppSelector } from '@/store/useAppSelector';
import { useBreakpoint } from '../useBreakpoint';
import { useBreakpoints } from '../useBreakpoints';

const NO_PROPERTIES = {};

export const useContainerElementProperties = (): Record<string, unknown> => {
  const container = useBreakpoint();
  const breakpoints = useBreakpoints();
  const elementsInBreakpoints = useAppSelector((state) => state.elementsInBreakpoints);

  const { transformElementProperty } = useProperties();
  const components = useComponentsProperty();

  const properties = useMemo(() => {
    if (!container.parentId) return NO_PROPERTIES;

    const parent = breakpoints.find(byBreakpointId(container.parentId));

    if (!parent) return NO_PROPERTIES;

    const elements = elementsInBreakpoints[parent.id];

    if (!elements) return NO_PROPERTIES;

    const element = elements.find(({ props }: WebBuilderElement): string | null => {
      const containerId = getElementContainerIdProp(props);
      if (containerId && containerId.value === container.id) return containerId.value;
      return null;
    });

    if (!element) return NO_PROPERTIES;

    const component = components.find(({ id }) => id === element.componentName);

    return getProperties(component, container, element, transformElementProperty);
  }, [container, breakpoints, elementsInBreakpoints, components, transformElementProperty]);

  return properties;
};
