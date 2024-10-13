import React, { createContext, useContext, useMemo } from 'react';
import { BuilderCommonProps, WebBuilderComponent } from 'types';

import { ElementContainer, useInternalComponents } from '@/components';
import { mergeArrays } from '@/utils/array';

const ComponentsContext = createContext<WebBuilderComponent[]>([]);

export const useComponentsProperty = (): WebBuilderComponent[] => {
  const props = useContext(ComponentsContext);
  return props;
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
      {children}
    </ComponentsContext.Provider>
  );
}
