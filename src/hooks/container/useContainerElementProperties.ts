import { useMemo } from 'react';

import { Breakpoint, ElementsInBreakpoints, WebBuilderElement } from 'types';
import { byBreakpointId } from '@/utils/breakpoint';
import { getElementContainerIdProp, getProperties } from '@/utils/element';
import { useProperties } from '@/components/PropertiesProvider';
import { useComponentsProperty } from '@/components/ComponentsProvider';

export const useContainerElementProperties = (
  container: Breakpoint,
  breakpoints: Breakpoint[],
  elementsInBreakpoints: ElementsInBreakpoints,
): Record<string, unknown> => {
  const { transformElementProperty } = useProperties();
  const components = useComponentsProperty();

  const properties = useMemo(() => {
    if (!container.parentId) return {};

    const parent = breakpoints.find(byBreakpointId(container.parentId));

    if (!parent) return {};

    const elements = elementsInBreakpoints[parent.id];

    if (!elements) return {};

    const element = elements.find(({ props }: WebBuilderElement): string | null => {
      const containerId = getElementContainerIdProp(props);
      if (containerId && containerId.value === container.id) return containerId.value;
      return null;
    });

    if (!element) return {};

    const component = components.find(({ id }) => id === element.componentName);

    return getProperties(component, container, element, transformElementProperty);
  }, [container, breakpoints, elementsInBreakpoints, components, transformElementProperty]);

  return properties;
};
