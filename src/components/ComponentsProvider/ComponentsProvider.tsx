import React, { createContext, useContext, useMemo } from 'react';
import { BuilderCommonProps, ElementContainer, WebBuilderComponent } from 'types';

import { useInternalComponents } from '@/components';
import { mergeArrays } from '@/utils/array';

const ComponentsContext = createContext<WebBuilderComponent[]>([]);
const ElementContainerContext = createContext<ElementContainer>(null);

export const useComponentsProperty = (): WebBuilderComponent[] => {
  const props = useContext(ComponentsContext);
  return props;
};

export const useElementContainer = () => {
  const elementContainer = useContext(ElementContainerContext);
  return elementContainer;
};

type ComponentsProviderProps = React.PropsWithChildren<BuilderCommonProps & {
  elementContainer: ElementContainer,
  components: WebBuilderComponent[],
}>;

const mergeItem = (a: WebBuilderComponent, b: WebBuilderComponent) => ({
  ...a,
  ...b,
  props: mergeArrays([a.props, b.props]),
});

export function ComponentsProvider({
  children, components, elementContainer, page, ...props
}: ComponentsProviderProps) {
  const internalComponents = useInternalComponents({
    elementContainer,
    components,
    page,
    ...props,
  });
  const allComponents = useMemo(
    () => mergeArrays([internalComponents, components], mergeItem),
    [internalComponents, components],
  );

  return (
    <ComponentsContext.Provider value={allComponents}>
      <ElementContainerContext.Provider value={elementContainer}>
        {children}
      </ElementContainerContext.Provider>
    </ComponentsContext.Provider>
  );
}
